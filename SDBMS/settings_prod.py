from .settings import *
import os
from decouple import config
import dj_database_url

DEBUG = config('DEBUG', default=False, cast=bool)
SECRET_KEY = config('SECRET_KEY')

ALLOWED_HOSTS = [
    '.vercel.app',  # Essential for Vercel deployment
    'localhost',
    '127.0.0.1',
]

# Database - Vercel does not support SQLite persistently
DATABASES = {
    'default': dj_database_url.config(
        default=config('DATABASE_URL'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# Static files - Adjusted for the Vercel Build process
STATIC_URL = '/static/'
# This must match the 'distDir' in your vercel.json
STATIC_ROOT = BASE_DIR / 'staticfiles_build' / 'static'

# WhiteNoise Storage
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    'https://student-db-management-pi.vercel.app',  # Remove the trailing slash
    'http://localhost:5173',
]

CORS_ALLOW_ALL_ORIGINS = False