import os
from django.core.wsgi import get_wsgi_application

# Tell Django to use the production settings if we're on Vercel
if os.environ.get('VERCEL'):
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'SDBMS.settings_production')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'SDBMS.settings')

application = get_wsgi_application()
app = application