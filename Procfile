release: python manage.py migrate --noinput
web: gunicorn fashintel.wsgi:application --bind 0.0.0.0:$PORT --log-level debug --timeout 120
