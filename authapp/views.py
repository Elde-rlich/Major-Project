from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.cache import never_cache
from django.contrib.auth.hashers import check_password, make_password
from recommender.utils import users, generate_user_id
from django.contrib.auth import authenticate, login as auth_login
from .forms import CustomerRegisterForm, BusinessRegisterForm, UserTypeSelectionForm
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure
from mongo_client import client_instance
import logging
from django.views.decorators.http import require_POST
from django.http import JsonResponse

logger = logging.getLogger(__name__)

@never_cache
def register(request):
    if request.method == 'POST':
        user_type = request.POST.get('user_type')
        
        try:
            users = client_instance.get_users_collection()
            if user_type == 'customer':
                username = request.POST.get('username')
                password = request.POST.get('password')
                password_confirm = request.POST.get('password_confirm')
                
                # Validate passwords match
                if password != password_confirm:
                    messages.error(request, 'Passwords do not match')
                    return render(request, 'authapp/register.html')
                
                # Check if username exists
                if users.find_one({'username': username}):
                    messages.error(request, 'Username already exists')
                    return render(request, 'authapp/register.html')
                
                # Generate user_id and save customer
                user_id = generate_user_id(username)
                try:
                    users.insert_one({
                        'username': username,
                        'user_id': user_id,
                        'password': make_password(password),
                        'user_type': 'customer'
                    })
                    messages.success(request, f'Customer account created for {username}!')
                    return redirect('login')  # Redirect to login page
                except Exception as e:
                    logger.error(f"Error creating customer {username}: {str(e)}")
                    messages.error(request, 'Error creating account')
                    
            elif user_type == 'business':
                business_name = request.POST.get('business_name')
                email = request.POST.get('email')
                hq_address = request.POST.get('hq_address')
                password = request.POST.get('password')
                password_confirm = request.POST.get('password_confirm')
                
                # Validate passwords match
                if password != password_confirm:
                    messages.error(request, 'Passwords do not match')
                    return render(request, 'authapp/register.html')
                
                # Check if business name or email exists
                if users.find_one({'business_name': business_name}):
                    messages.error(request, 'Business name already exists')
                    return render(request, 'authapp/register.html')
                
                if users.find_one({'email': email}):
                    messages.error(request, 'Email already exists')
                    return render(request, 'authapp/register.html')
                
                # Generate user_id and save business
                user_id = generate_user_id(business_name)
                try:
                    users.insert_one({
                        'business_name': business_name,
                        'email': email,
                        'hq_address': hq_address,
                        'user_id': user_id,
                        'password': make_password(password),
                        'user_type': 'business'
                    })
                    messages.success(request, f'Business account created for {business_name}!')
                    return redirect('login')  # Redirect to login page
                except Exception as e:
                    logger.error(f"Error creating business {business_name}: {str(e)}")
                    messages.error(request, 'Error creating account')
            else:
                messages.error(request, 'Please select a user type')
        
        except (ServerSelectionTimeoutError, ConnectionFailure) as e:
            logger.error(f"MongoDB connection timeout: {e}")
            messages.error(request, 'Database connection error. Please try again later.')
        except Exception as e:
            logger.error(f"Registration error: {e}")
            messages.error(request, 'An error occurred during registration. Please try again.')
    return render(request, 'authapp/register.html')


def login(request):
    if request.method == 'POST':
        user_type = request.POST.get('user_type')
        
        try:
            users = client_instance.get_users_collection()
            if user_type == 'customer':
                username = request.POST.get('username')
                password = request.POST.get('password')
                
                # Find customer user in MongoDB
                mongo_user = users.find_one({'username': username, 'user_type': 'customer'})
                if mongo_user and check_password(password, mongo_user['password']):
                    # Authenticate using your custom backend
                    user = authenticate(request, username=username, password=password)
                    if user is not None:
                        auth_login(request, user)
                        messages.success(request, f'Welcome back, {username}!')
                        return redirect('home')
                
                messages.error(request, 'Invalid customer username or password')
            
            elif user_type == 'business':
                business_name = request.POST.get('business_name')
                password = request.POST.get('password')
                
                # Find business user in MongoDB
                mongo_user = users.find_one({'business_name': business_name, 'user_type': 'business'})
                if mongo_user and check_password(password, mongo_user['password']):
                    # For businesses, we'll just set a session for now
                    # In the future, you can create a proper Django user for businesses too
                    request.session['business_user'] = {
                        'business_name': business_name,
                        'user_type': 'business',
                        'user_id': mongo_user['user_id']
                    }
                    messages.success(request, f'Welcome back, {business_name}!')
                    return redirect('home')  # For now, redirect to home (later: business dashboard)
                
                messages.error(request, 'Invalid business name or password')
            
            else:
                messages.error(request, 'Please select a user type')
        except (ServerSelectionTimeoutError, ConnectionFailure) as e:
            logger.error(f"MongoDB connection timeout during login: {e}")
            messages.error(request, 'Database connection error. Please try again later.')
        except Exception as e:
            logger.error(f"Login error: {e}")
            messages.error(request, 'An error occurred during login. Please try again.')
    return render(request, 'authapp/login.html')

@require_POST
def logout(request):
    # Clear both Django user session and business session
    if request.user.is_authenticated:
        from django.contrib.auth import logout as auth_logout
        auth_logout(request)
    
    if 'business_user' in request.session:
        del request.session['business_user']
    
    if 'user_id' in request.session:
        del request.session['user_id']
    
    request.session.flush()
    messages.success(request, 'Logged out successfully!')
    return redirect('landing')