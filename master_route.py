
# Original imports
# import base64
# try:
#     from functools import lru_cache
# except ImportError:
#     from functools32 import lru_cache
# import json
# import os
# import re
# import time
# import urllib

# import logging

# import flask
# from flask import request
# from google.appengine.api import app_identity
# from google.appengine.api import users
# from google.appengine.ext import ndb
# import httplib2
# from oauth2client.client import GoogleCredentials
# # from oauth2client.service_account import ServiceAccountCredentials

"""Tic Tac Toe with the Firebase API"""

import flask

from tictactoe.ttt_routes import ttt
from counter.counter_routes import count
from temp.typeloader import loader
from sessions.session_routes import sess

app = flask.Flask(__name__)
app.register_blueprint(ttt)
app.register_blueprint(count)
app.register_blueprint(loader)
app.register_blueprint(sess)
