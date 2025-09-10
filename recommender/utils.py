import os
import logging
import pandas as pd
import numpy as np
from pymongo import MongoClient
from lightfm import LightFM
from lightfm.data import Dataset
from decouple import config
import joblib
import json
import hashlib
import re

# Configure logging
logger = logging.getLogger(__name__)

# MongoDB connection
#client = MongoClient('mongodb://localhost:27017/')

MONGODB_URI = config('MONGODB_URI')

client = MongoClient(
    MONGODB_URI,
    serverSelectionTimeoutMS=5000,  # 5 seconds timeout
    connectTimeoutMS=5000,          # 5 seconds to connect
    socketTimeoutMS=5000,           # 5 seconds for socket operations
    maxPoolSize=10,                 # Connection pool size
    retryWrites=True
)
db = client['fashion_db']
interactions = db['interactions']
products = db['products']
users = db['users']
feature_mappings = db['feature_mappings']

WEIGHT_MAP = {
    'purchase': 5.0,
    'cart': 3.0,
    'like': 2.0,
    'click': 1.0,
    'dislike': 0.0
}

def generate_user_id(username):
    # Sanitize username (lowercase, remove special chars)
    sanitized = re.sub(r'[^a-zA-Z0-9]', '', username.lower())
    # Generate stable hash suffix (first 8 chars of SHA-256)
    hash_suffix = hashlib.sha256(username.encode()).hexdigest()[:8]
    user_id = f"{sanitized}_{hash_suffix}"
    # Ensure uniqueness in MongoDB
    while users.find_one({'user_id': user_id}):
        hash_suffix = hashlib.sha256((username + str(len(user_id))).encode()).hexdigest()[:8]
        user_id = f"{sanitized}_{hash_suffix}"
    return user_id


def create_feature_mappings(df):
    mappings = {}
    categorical_features = ['main_category', 'sub_category', 'material', 'color', 'occasion',  
                           'brand', 'title', 'fit', 'sleeve_length', 'neck', 'waist_rise', 
                           'closure', 'print_or_pattern_type', 'shape', 'length', 'collar', 
                           'preprocessed_product_details']
    for feature in categorical_features:
        unique_values = sorted(df[feature].dropna().astype(str).str.lower().unique())
        mappings[feature] = {val: idx + 1 for idx, val in enumerate(unique_values)}
    return mappings

def parse_product_attributes(row, mappings):
    attributes = {
        'color': str(row['color']).lower() if pd.notna(row['color']) else 'unknown',
        'material': str(row['material']).lower() if pd.notna(row['material']) else 'unknown',
        'category': str(row['sub_category']).lower() if pd.notna(row['sub_category']) else 'unknown',
        'main_category': str(row['main_category']).lower() if pd.notna(row['main_category']) else 'unknown',
        'fit': str(row['fit']).lower() if pd.notna(row['fit']) else 'unknown',
        'occasion': str(row['occasion']).lower() if pd.notna(row['occasion']) else 'unknown',
        'brand': str(row['brand']).lower() if pd.notna(row['brand']) else 'unknown',
        'title': str(row['title']).lower() if pd.notna(row['title']) else 'unknown',
        'sleeve_length': str(row['sleeve_length']).lower() if pd.notna(row['sleeve_length']) else 'unknown',
        'neck': str(row['neck']).lower() if pd.notna(row['neck']) else 'unknown',
        'waist_rise': str(row['waist_rise']).lower() if pd.notna(row['waist_rise']) else 'unknown',
        'closure': str(row['closure']).lower() if pd.notna(row['closure']) else 'unknown',
        'print_or_pattern_type': str(row['print_or_pattern_type']).lower() if pd.notna(row['print_or_pattern_type']) else 'unknown',
        'shape': str(row['shape']).lower() if pd.notna(row['shape']) else 'unknown',
        'length': str(row['length']).lower() if pd.notna(row['length']) else 'unknown',
        'collar': str(row['collar']).lower() if pd.notna(row['collar']) else 'unknown',
        'preprocessed_product_details': str(row['preprocessed_product_details']).lower() if pd.notna(row['preprocessed_product_details']) else 'unknown',
        'encoded_color': mappings['color'].get(str(row['color']).lower(), 0),
        'encoded_material': mappings['material'].get(str(row['material']).lower(), 0),
        'encoded_category': mappings['sub_category'].get(str(row['sub_category']).lower(), 0),
        'encoded_main_category': mappings['main_category'].get(str(row['main_category']).lower(), 0),
        'encoded_brand': mappings['brand'].get(str(row['brand']).lower(), 0),
        'encoded_title': mappings['title'].get(str(row['title']).lower(), 0),
        'encoded_sleeve_length': mappings['sleeve_length'].get(str(row['sleeve_length']).lower(), 0),
        'encoded_occasion': mappings['occasion'].get(str(row['occasion']).lower(), 0),
        'encoded_fit': mappings['fit'].get(str(row['fit']).lower(), 0),
        'encoded_neck': mappings['neck'].get(str(row['neck']).lower(), 0),
        'encoded_waist_rise': mappings['waist_rise'].get(str(row['waist_rise']).lower(), 0),
        'encoded_closure': mappings['closure'].get(str(row['closure']).lower(), 0),
        'encoded_print_or_pattern_type': mappings['print_or_pattern_type'].get(str(row['print_or_pattern_type']).lower(), 0),
        'encoded_shape': mappings['shape'].get(str(row['shape']).lower(), 0),
        'encoded_length': mappings['length'].get(str(row['length']).lower(), 0),
        'encoded_collar': mappings['collar'].get(str(row['collar']).lower(), 0),
        'encoded_preprocessed_product_details': mappings['preprocessed_product_details'].get(str(row['preprocessed_product_details']).lower(), 0)
    }
    important_fields = ['fit', 'occasion', 'color', 'material', 'brand']
    for field in important_fields:
        if pd.isna(row.get(field)):
            logger.warning(f"Missing '{field}' in row with id: {row.get('id')}")
    return attributes

def load_myntra_dataset():
    try:
        csv_file = os.getenv('DATASET_PATH', 'C:/Users/HP/Documents/College/maj - proj/Dataset/cleaned_products1.csv')
        logger.info(f"Loading dataset from {csv_file}")
        
        if not os.path.exists(csv_file):
            logger.error(f"Dataset file not found: {csv_file}")
            return False, None
        
        product_count = products.count_documents({})
        feature_count = feature_mappings.count_documents({})
        if product_count > 0 and feature_count > 0:
            logger.info(f"Collections already populated: {product_count} products, {feature_count} feature mappings, skipping load")
            product_df = pd.DataFrame(list(products.find({}, {
                'product_id': 1, 
                'product_attributes.category': 1, 
                'brand': 1, 
                'product_attributes.color': 1
            })))
            product_df = product_df.rename(columns={'product_attributes.category': 'category'})
            return True, product_df
        
        df = pd.read_csv(csv_file)
        if df.empty:
            logger.error("CSV file is empty")
            return False, None
        
        logger.info(f"Loaded CSV with {len(df)} products")
        
        duplicates = df[df['id'].duplicated(keep=False)]
        if not duplicates.empty:
            logger.warning(f"Found {len(duplicates)} duplicate id values:\n{duplicates[['id']].head()}")
            df = df.drop_duplicates(subset='id', keep='first')
            logger.info(f"Kept first occurrence of {len(df)} unique products")
        
        if 'pattern' not in df.columns or df['pattern'].isna().all():
            logger.warning("No pattern data in CSV, excluding pattern from product_attributes")
        
        product_df = df[['id', 'sub_category', 'brand', 'color']].copy()
        product_df = product_df.rename(columns={'id': 'product_id', 'sub_category': 'category'})
        
        mappings = create_feature_mappings(df)
        feature_mappings.insert_one({'mappings': mappings})
        logger.info("Stored feature mappings")
        
        df.fillna({
            'fit': 'unknown', 
            'occasion': 'unknown', 
            'color': 'unknown',
            'material': 'unknown', 
            'brand': 'unknown', 
            'main_category': 'unknown',
            'sub_category': 'unknown', 
            'sleeve_length': 'unknown', 
            'title': 'unknown',
            'neck': 'unknown', 
            'waist_rise': 'unknown',
            'closure': 'unknown',
            'print_or_pattern_type': 'unknown', 
            'shape': 'unknown', 
            'length': 'unknown',
            'collar': 'unknown', 
            'preprocessed_product_details': 'unknown'
        }, inplace=True)
        
        records = []
        for _, row in df.iterrows():
            if pd.isna(row['id']):
                logger.warning(f"Missing id in row: {row.to_dict()}")
                continue
            title = f"{row['brand']} {row['sub_category']} ({row['color']}, {row['fit']}, {row['occasion']})"
            record = {
                'product_id': str(row['id']),
                'title': title,
                'image_url': f"/images/{row['id']}.jpg",  # Keep original image_url
                'url': '#',
                'product_attributes': parse_product_attributes(row, mappings),
                'brand': str(row['brand']).lower(),
                'sleeve_length': str(row['sleeve_length']).lower(),
                'occasion': str(row['occasion']).lower(),
                'fit': str(row['fit']).lower(),
                'neck': str(row['neck']).lower(),
                'waist_rise': str(row['waist_rise']).lower(),
                'closure': str(row['closure']).lower(),
                'print_or_pattern_type': str(row['print_or_pattern_type']).lower(),
                'shape': str(row['shape']).lower(),
                'length': str(row['length']).lower(),
                'collar': str(row['collar']).lower()
            }
            records.append(record)
        
        if records:
            inserted = 0
            updated = 0
            for record in records:
                result = products.update_one(
                    {'product_id': record['product_id']},
                    {'$set': record},
                    upsert=True
                )
                if result.matched_count > 0:
                    updated += 1
                elif result.upserted_id:
                    inserted += 1
            products.create_index([('product_id', 1)], unique=True)
            logger.info(f"Inserted {inserted} new products, updated {updated} existing products in MongoDB")
        else:
            logger.error("No valid products loaded")
            return False, None
        
        return True, product_df
    
    except FileNotFoundError:
        logger.error(f"Dataset file not found: {csv_file}")
        return False, None
    except Exception as e:
        logger.error(f"Error loading dataset: {str(e)}")
        return False, None

def load_lightfm_model():
    try:
        model, dataset, interactions_matrix = joblib.load('lightfm_model.pkl')
        logger.info("Loaded LightFM model, dataset, and interactions matrix from lightfm_model.pkl")
        return model, dataset, interactions_matrix
    except FileNotFoundError:
        logger.warning("Model file not found, training new model")
        # Placeholder: Add training logic if needed
        return None, None, None
    except Exception as e:
        logger.error(f"Error loading LightFM model: {str(e)}")
        return None, None, None
    

def get_recommendations(user_id, top_n=8, model=None, dataset=None, product_df=None, interactions_matrix=None):
    if model is None or dataset is None or interactions_matrix is None:
        logger.error("Model, dataset, or interactions matrix not provided")
        return []
    
    try:
        user_idx = dataset.mapping()[0].get(user_id)
        recommendations = []
        item_mapping = dataset.mapping()[2]
        reverse_item_mapping = {idx: item_id for item_id, idx in item_mapping.items()}
        
        if user_idx is None or interactions_matrix[user_idx].nnz == 0:
            logger.info(f"Cold-start for user {user_id}, using popular items")
            item_popularity = interactions_matrix.sum(axis=0).A1
            valid_indices = [idx for idx in np.argsort(-item_popularity) if idx in reverse_item_mapping]
            top_items = valid_indices[:top_n]
            
            for item_idx in top_items:
                try:
                    product_id = reverse_item_mapping[item_idx]
                    logger.debug(f"Item index: {item_idx} (type: {type(item_idx)}), Product ID: {product_id} (type: {type(product_id)})")
                    product = products.find_one({'product_id': product_id})
                    if product:
                        recommendations.append({
                            'product_id': product_id,
                            'title': product.get('title', 'Unknown'),
                            'category': product.get('product_attributes', {}).get('category', 'unknown'),
                            'brand': product.get('brand', 'unknown'),
                            'color': product.get('product_attributes', {}).get('color', 'unknown'),
                            'image_url': product.get('image_url', '/images/default.jpg'),
                            'score': float(item_popularity[item_idx])
                        })
                    else:
                        logger.warning(f"Product ID {product_id} not found in MongoDB")
                except Exception as e:
                    logger.error(f"Error processing item_idx {item_idx}: {str(e)}")
                    continue
        else:
            scores = model.predict(user_idx, np.arange(dataset.item_features_shape()[0]))
            top_items = np.argsort(-scores)[:top_n * 2]
            
            for item_idx in top_items:
                product_id = reverse_item_mapping.get(item_idx)
                if not product_id:
                    logger.warning(f"Item index {item_idx} not found in reverse_item_mapping")
                    continue
                product = products.find_one({'product_id': product_id})
                if product:
                    recommendations.append({
                        'product_id': product_id,
                        'title': product.get('title', 'Unknown'),
                        'category': product.get('product_attributes', {}).get('category', 'unknown'),
                        'brand': product.get('brand', 'unknown'),
                        'color': product.get('product_attributes', {}).get('color', 'unknown'),
                        'image_url': product.get('image_url', '/images/default.jpg'),
                        'score': float(scores[item_idx])
                    })
                if len(recommendations) >= top_n:
                    break
        
        logger.info(f"Generated {len(recommendations)} recommendations for user {user_id}")
        return recommendations
    
    except Exception as e:
        logger.error(f"Error generating recommendations for user {user_id}: {str(e)}")
        return []    