#!/bin/bash
# Load credentials from local folder and start
FILE=./firebase-test-222916-firebase-adminsdk-slzkf-826b7cb679.json
if [ -f $FILE ]; then
    # If file exists
    export GOOGLE_APPLICATION_CREDENTIALS=$FILE
    google-cloud-sdk\ 2/bin/dev_appserver.py .
else
    echo "Keyfile not found! Download it from drive and place in this directory"
fi
