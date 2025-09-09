from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from pymongo import MongoClient

# Your MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['fashion_db']
users = db['users']

class MongoBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None):
        try:
            # Find user in MongoDB (works for both customer and business users)
            mongo_user = users.find_one({
                '$or': [
                    {'username': username},
                    {'business_name': username}  # Allow business login with business name as username
                ]
            })
            
            if mongo_user and check_password(password, mongo_user['password']):
                # Create or get Django User object
                try:
                    # Use username for customers, business_name for businesses
                    django_username = mongo_user.get('username') or mongo_user.get('business_name')
                    user = User.objects.get(username=django_username)
                except User.DoesNotExist:
                    # Create Django user for session management
                    user = User.objects.create_user(
                        username=django_username,
                        password=mongo_user['password'],
                        is_active=True
                    )
                return user
        except Exception as e:
            print(f"Authentication error: {e}")
            return None
        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None