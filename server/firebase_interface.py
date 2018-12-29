"""
This module stores the basic building blocks for connecting with elements through firebase
PLEASE DO NOT CHANGE THIS!
Changing this will break everything forever
"""

import base64
try:
    from functools import lru_cache
except ImportError:
    from functools32 import lru_cache
import json
import os
import re
import time
import urllib

import logging

from google.appengine.api import app_identity
import httplib2
from oauth2client.client import GoogleCredentials

_FIREBASE_CONFIG = '_firebase_config.html'

_IDENTITY_ENDPOINT = ('https://identitytoolkit.googleapis.com/'
                      'google.identity.identitytoolkit.v1.IdentityToolkit')
_FIREBASE_SCOPES = [
    'https://www.googleapis.com/auth/firebase.database',
    'https://www.googleapis.com/auth/userinfo.email']
# Memoize the value, to avoid parsing the code snippet every time


@lru_cache()
def _get_firebase_db_url():
    """Grabs the databaseURL from the Firebase config snippet. Regex looks
    scary, but all it is doing is pulling the 'databaseURL' field from the
    Firebase javascript snippet"""
    regex = re.compile(r'\bdatabaseURL\b.*?["\']([^"\']+)')
    cwd = os.path.dirname(__file__)
    try:
        with open(os.path.join(cwd, 'templates', _FIREBASE_CONFIG)) as f:
            url = next(regex.search(line) for line in f if regex.search(line))
    except StopIteration:
        raise ValueError(
            'Error parsing databaseURL. Please copy Firebase web snippet '
            'into templates/{}'.format(_FIREBASE_CONFIG))
    return url.group(1)


# Memoize the authorized http, to avoid fetching new access tokens
@lru_cache()
def _get_http():
    """Provides an authed http object."""
    http = httplib2.Http()
    # Use application default credentials to make the Firebase calls
    # https://firebase.google.com/docs/reference/rest/database/user-auth
    creds = GoogleCredentials.get_application_default().create_scoped(
        _FIREBASE_SCOPES)

    # creds = ServiceAccountCredentials.from_json_keyfile_name(pathf, _FIREBASE_SCOPES)
    creds.authorize(http)
    return http


def _send_firebase_message(u_id, message=None):
    """Updates data in firebase. If a message is provided, then it updates
     the data at /channels/<channel_id> with the message using the PATCH
     http method. If no message is provided, then the data at this location
     is deleted using the DELETE http method
     """
    url = '{}/channels/{}.json'.format(_get_firebase_db_url(), u_id)

    if message:
        return _get_http().request(url, 'PATCH', body=message)
    else:
        return _get_http().request(url, 'DELETE')


def create_custom_token(uid, valid_minutes=60):
    """Create a secure token for the given id.

    This method is used to create secure custom JWT tokens to be passed to
    clients. It takes a unique id (uid) that will be used by Firebase's
    security rules to prevent unauthorized access. In this case, the uid will
    be the channel id which is a combination of user_id and game_key
    """

    # use the app_identity service from google.appengine.api to get the
    # project's service account email automatically
    client_email = app_identity.get_service_account_name()
    # creds = ServiceAccountCredentials.from_json_keyfile_name(pathf, _FIREBASE_SCOPOES)
    # client_email = creds.service_account_email
    logging.info("client Email " + client_email)
    # client_email = "firebase-adminsdk-slzkf@firebase-test-222916.iam.gserviceaccount.com"
    # logging.info("Client Email: " + client_email)
    now = int(time.time())
    # encode the required claims
    # per https://firebase.google.com/docs/auth/server/create-custom-tokens
    payload = base64.b64encode(json.dumps({
        'iss': client_email,
        'sub': client_email,
        'aud': _IDENTITY_ENDPOINT,
        'uid': uid,  # the important parameter, as it will be the channel id
        'iat': now,
        'exp': now + (valid_minutes * 60),
    }))
    # add standard header to identify this as a JWT
    header = base64.b64encode(json.dumps({'typ': 'JWT', 'alg': 'RS256'}))
    to_sign = '{}.{}'.format(header, payload)
    # Sign the jwt using the built in app_identity service
    return '{}.{}'.format(to_sign, base64.b64encode(
        app_identity.sign_blob(to_sign)[1]))
        # creds.sign_blob(to_sign)
