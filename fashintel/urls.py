"""
URL configuration for fashintel project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# from django.http import JsonResponse
# import traceback
# import sys


# def safe_debug_view(request):
#     try:
#         import django
#         import pymongo
#         import lightfm
        
#         return JsonResponse({
#             "status": "SUCCESS",
#             "message": "Django Fashion Recommender is working!",
#             "path": request.path,
#             "django_version": django.get_version(),
#             "python_version": sys.version,
#             "pymongo_available": bool(pymongo),
#             "lightfm_available": bool(lightfm),
#             "debug": True
#         })
#     except Exception as e:
#         return JsonResponse({
#             "status": "ERROR",
#             "error": str(e),
#             "traceback": traceback.format_exc(),
#             "path": request.path
#         }, status=500)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('authapp.urls')),
    path('catalog/', include('recommender.urls')),
    path('', include('landing.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
