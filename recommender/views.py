import logging
import hashlib
import uuid
import os
import pandas as pd
from datetime import datetime
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .utils import products, interactions, load_myntra_dataset, load_lightfm_model, get_recommendations, users
from django.http import Http404
import json
from recommender.utils import interactions, products

logger = logging.getLogger(__name__)

def generate_user_id(request):
    ip_address = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR'))
    if ',' in ip_address:
        ip_address = ip_address.split(',')[0].strip()
    
    if not ip_address or ip_address.startswith(('10.', '172.', '192.168.')):
        if 'random_user_id' not in request.session:
            request.session['random_user_id'] = str(uuid.uuid4())
        return hashlib.sha256(request.session['random_user_id'].encode('utf-8')).hexdigest()
    
    return hashlib.sha256(ip_address.encode('utf-8')).hexdigest()


def home(request):
    #user_id = request.session.get('user_id')
    if not request.user.is_authenticated:
        return redirect('login')

    username = request.user.username
    mongo_user = users.find_one({'username': username})
    user_id = mongo_user['user_id'] if mongo_user else None
    #print(user_id)

    success, product_df = load_myntra_dataset()
    if not success:
        logger.error("Failed to load dataset")
        return render(request, 'recommender/catalog.html', {
            'error': 'Failed to load product data',
            'products': [],
            'recommendations': [],
            'categories': [],
            'user_id': user_id,
            'username': username,
            'page': 1,
            'total_pages': 1,
            'search_query': '',
            'category_filter': ''
        })
    
    model, dataset, interactions_matrix = load_lightfm_model()
    if model is None:
        logger.error("Failed to load LightFM model")
        return render(request, 'recommender/catalog.html', {
            'error': 'Failed to load recommendation model',
            'products': [],
            'recommendations': [],
            'categories': [],
            'user_id': user_id,
            'username': username,
            'page': 1,
            'total_pages': 1,
            'search_query': '',
            'category_filter': ''
        })
    
    categories = sorted(products.distinct('product_attributes.category')) or ['t-shirt', 'saree', 'shirt']
    
    search_query = request.GET.get('search', '')
    category_filter = request.GET.get('category', '')

    try:
        page = int(request.GET.get('page', '1'))
        if page < 1:
            page = 1  # Ensure page is at least 1
    except (ValueError, TypeError):
        logger.warning(f"Invalid page parameter: {request.GET.get('page')}")
        page = 1

    per_page = 20
    query = {}
    if search_query:
        query['title'] = {'$regex': search_query, '$options': 'i'}
    if category_filter:
        query['product_attributes.category'] = category_filter
    
    product_list = list(products.find(query, {
        'product_id': 1,
        'title': 1,
        'product_attributes': 1,
        'brand': 1,
        'image_url': 1
    }).skip((page-1)*per_page).limit(per_page))
    total_products = products.count_documents(query)
    total_pages = max(1, (total_products + per_page - 1) // per_page)
    
    max_pages = 10  # Maximum number of page links to show
    start_page = max(1, page - max_pages // 2)
    end_page = min(total_pages, start_page + max_pages - 1)
    if end_page - start_page < max_pages:
        start_page = max(1, end_page - max_pages + 1)

    page_range = list(range(start_page, end_page+1))
    
    message = None
    error = None
    if request.method == 'POST':
        interaction_type = request.POST.get('interaction_type')
        product_id = request.POST.get('product_id')

        logger.info(f"  - interaction_type: {interaction_type}")
        logger.info(f"  - product_id: {product_id}")
        logger.info(f"  - user_id: {user_id}")

        if interaction_type and product_id:
            data = {
                'user_id': user_id,
                'interaction_type': interaction_type,
                'product_id': product_id,
                'product_attributes': None,
                'timestamp': datetime.utcnow()
            }
            try:
                interactions.insert_one(data)
                message = f"Interaction ({interaction_type}) logged successfully!"
            except Exception as e:
                logger.error(f"Error logging interaction: {str(e)}")
                error = "Error logging interaction"
    
    try:
        recommendations = get_recommendations(
            user_id=user_id,
            top_n=8,
            model=model,
            dataset=dataset,
            product_df=product_df,
            interactions_matrix=interactions_matrix
        )
    except Exception as e:
        logger.error(f"Failed to get recommendations for user {user_id}: {str(e)}")
        recommendations = []
        error = error or "Failed to generate recommendations"
    
    return render(request, 'recommender/catalog.html', {
        'products': product_list,
        'recommendations': recommendations,
        'categories': categories,
        'user_id': user_id,
        'username': username,
        'page': page,
        'total_pages': total_pages,
        'page_range': page_range,
        'search_query': search_query,
        'category_filter': category_filter,
        'message': message,
        'error': error
    })

def serve_image(request, filename):
    image_path = os.path.join(settings.MEDIA_ROOT, filename)
    if os.path.exists(image_path):
        return FileResponse(open(image_path, 'rb'), content_type='image/jpeg')
    else:
        default_image_path = os.path.join(settings.MEDIA_ROOT, 'default.jpg')
        if os.path.exists(default_image_path):
            return FileResponse(open(default_image_path, 'rb'), content_type='image/jpeg')
        raise Http404("Image not found")

@csrf_exempt
def log_interaction(request):
    if request.method != 'POST':
        return JsonResponse({'message': 'Method not allowed'}, status=405)
    
    # Check if user is authenticated
    user_id = request.session.get('user_id')
    if not user_id:
        return JsonResponse({'message': 'User not logged in'}, status=401)
    
    try:
        data = json.loads(request.body)
        required_keys = ['interaction_type', 'product_id']
        if not all(key in data for key in required_keys):
            return JsonResponse({'message': 'Missing required fields: interaction_type, product_id'}, status=400)
        
        interaction_type = data['interaction_type']
        product_id = data['product_id']
        product_attributes = data.get('product_attributes')
        
        # Optional: Validate interaction (if validate_interaction exists)
        # from recommender.utils import validate_interaction
        # if not validate_interaction(user_id, product_id, interaction_type):
        #     return JsonResponse({'message': 'Invalid interaction'}, status=400)
        
        # Verify product_id exists in products collection
        if not products.find_one({'product_id': product_id}):
            logger.warning(f"Invalid product_id: {product_id}")
            return JsonResponse({'message': 'Invalid product_id'}, status=400)
        
        # Log interaction
        interaction = {
            'user_id': user_id,  # Use session user_id
            'product_id': product_id,
            'interaction_type': interaction_type,
            'timestamp': datetime.utcnow(),
            'product_attributes': product_attributes
        }
        interactions.insert_one(interaction)
        logger.info(f"Interaction logged: user_id={user_id}, product_id={product_id}, type={interaction_type}")
        return JsonResponse({'message': 'Interaction logged'}, status=201)
    except json.JSONDecodeError:
        logger.error("Invalid JSON in request body")
        return JsonResponse({'message': 'Invalid JSON format'}, status=400)
    except Exception as e:
        logger.error(f"Error logging interaction: {str(e)}")
        return JsonResponse({'message': f'Error logging interaction: {str(e)}'}, status=500)