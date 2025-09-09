from django.shortcuts import render
from recommender.utils import products
import logging

logger = logging.getLogger(__name__)

def landing(request):
    user_id = request.session.get('user_id')

    context = {
        'user_id' : user_id,
        'message' : request.GET.get('message', '')
    }

    return render(request, 'landing/landing.html', context)