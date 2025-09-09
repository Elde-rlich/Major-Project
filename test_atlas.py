# test_atlas.py
from decouple import config
from pymongo import MongoClient

MONGODB_URI = config('MONGODB_URI')

try:
    client = MongoClient(MONGODB_URI)
    client.admin.command('ping')
    print("✓ Atlas connection successful!")
    
    db = client['fashion_db']
    print(f"Collections: {db.list_collection_names()}")
    
except Exception as e:
    print(f"✗ Connection failed: {e}")
