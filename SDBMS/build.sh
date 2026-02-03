#!/bin/bash
# Install dependencies
python3.12 -m pip install -r requirements.txt

# Run collectstatic using the production settings specifically
python3.12 manage.py collectstatic --noinput --clear --settings=SDBMS.setting_prod