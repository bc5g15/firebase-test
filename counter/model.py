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

from firebase_interface import _send_firebase_message

# import flask
# from flask import request
from google.appengine.api import app_identity
from google.appengine.api import users
from google.appengine.ext import ndb
import httplib2
from oauth2client.client import GoogleCredentials
# from oauth2client.service_account import ServiceAccountCredentials


class Counter(ndb.Model):
    """Data stored for a counting experiment"""
    # Allow multiple users
    users = ndb.StringProperty(repeated=True)
    recentUser = ndb.StringProperty()
    count = ndb.IntegerProperty()

    # Very basic method for now
    def to_json(self):
        """A simple JSON reference to myself that can be passed back and forth"""
        d = self.to_dict()
        # return json.dumps(d, default=lambda user: user.user_id())
        return json.dumps(d)

    def send_update(self):
        """Update firebase and users with the new score // users"""
        message = self.to_json()

        logging.info(len(self.users))
        # send updated game state to all users
        for u in self.users:
            _send_firebase_message(
                u + self.key.id(), message=message)

    def add(self, user):
        """A user adds a value to the counter"""
        self.recentUser = user
        self.count += 1
        logging.info("New Value = " + str(self.count))
        self.put()
        self.send_update()
        return

    def add_user(self, user):
        """Add a user to the counter"""
        logging.info(len(self.users))
        # Only add the user if we haven't already
        if not user in self.users:
            self.users.append(user)
            logging.info(len(self.users))
            self.put()
            self.send_update()
        return
