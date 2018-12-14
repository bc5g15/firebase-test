@ECHO OFF
set "keyfile=./firebase-test-222916-firebase-adminsdk-slzkf-826b7cb679.json"
REM load the private key into the local memory
IF EXIST %keyfile% (
    set GOOGLE_APPLICATION_CREDENTIALS=%keyfile%
    dev_appserver.py .
) ELSE (
    echo "Keyfile not found! Please put it in this directory from the google drive!"
)