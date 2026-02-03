from .settings import *
import os
from decouple import config
import dj_database_url

DEBUG = config('DEBUG', default=False, cast=bool)
SECRET_KEY = config('SECRET_KEY', default='your-secret-key-change-this')

ALLOWED_HOSTS = [
    '.railway.app',
    '.render.com',
    'localhost',
    '127.0.0.1',
]

# Database - Use PostgreSQL in production
DATABASES = {
    'default': dj_database_url.config(
        default=config('DATABASE_URL', default='sqlite:///db.sqlite3'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# CORS for production - Update with your Vercel domain
CORS_ALLOWED_ORIGINS = [
    'https://your-frontend.vercel.app',  # Update this!
    'http://localhost:5173',  # Keep for local testing
]

CORS_ALLOW_ALL_ORIGINS = False  # Set to False in production