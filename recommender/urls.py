from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('images/<path:filename>', views.serve_image, name='serve_image'),
]