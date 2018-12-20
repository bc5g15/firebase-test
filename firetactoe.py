# Copyright 2016 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Tic Tac Toe with the Firebase API"""

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

from firebase_interface import _send_firebase_message, create_custom_token

import flask
from flask import request
from google.appengine.api import app_identity
from google.appengine.api import users
from google.appengine.ext import ndb
import httplib2
from oauth2client.client import GoogleCredentials
# from oauth2client.service_account import ServiceAccountCredentials

# pathf variable for private key file

from tictactoe.ttt_routes import ttt

app = flask.Flask(__name__)
app.register_blueprint(ttt)

"""
AFTER THIS POINT IS TIC-TAC-TOE CODE
"""



"""
Everything after this point is original code
"""


@app.route('/test')
def test_me():
    """Just for me to test things"""
    user = users.get_current_user()
    game_key = user.user_id()
    game = Game.get_by_id(game_key)
    if not game:
        return 'No such game', 404
    else:
        return game.to_json()

class Counter(ndb.Model):
    """Data stored for a counting experiment"""
    # Allow multiple users
    users = ndb.UserProperty(repeated=True)
    recentUser = ndb.UserProperty()
    count = ndb.IntegerProperty()

    # Very basic method for now
    def to_json(self):
        """A simple JSON reference to myself that can be passed back and forth"""
        d = self.to_dict()
        return json.dumps(d, default=lambda user: user.user_id())

    def send_update(self):
        """Update firebase and users with the new score // users"""
        message = self.to_json()

        logging.info(len(self.users))
        #send updated game state to all users
        for u in self.users:
            _send_firebase_message(
                u.user_id() + self.key.id(), message=message)
        # _send_firebase_message(
        #     self.recentUser.user_id() + self.key.id(), message=message
        # )

    def add(self, user):
        """A user adds a value to the counter"""
        self.recentUser = user
        self.count+=1
        logging.info("New Value = " + str(self.count))
        self.put()
        self.send_update()
        return

    def add_user(self, user):
        """Add a user to the counter"""
        logging.info(len(self.users))
        #Only add the user if we haven't already
        if not user in self.users:
            self.users.append(user)
            logging.info(len(self.users))
            self.put()
            self.send_update()
        return


@app.route('/count-lobby')
def new_lobby():
    logging.info("Main Lobby introduction")
    user = users.get_current_user()
    key = request.args.get('g')
    if not key:
        #Create a new game
        key = user.user_id()
        counter = Counter(id = key, recentUser = user, count = 0, users = [user])
        counter.put()
    else:
        counter = Counter.get_by_id(key)
        if not counter:
            return 'No Such Lobby', 404
        if not user in counter.users:
            counter.add_user(user)

    channel_id = user.user_id() + key
    # Support joining with an id in the url
    logging.info("I should only see this once")
    # Create a new counter if one doesn't already exist

    # [START pass_token]
    client_auth_token = create_custom_token(channel_id)
    _send_firebase_message(channel_id, message=counter.to_json())

    game_link = '{}?g={}'.format(request.base_url, key)
    template_values = {
        'token': client_auth_token,
        'channel_id': channel_id,
        'me': user.user_id(),
        'game_key': key,
        'game_link': game_link,
        'initial_message': urllib.unquote(counter.to_json())
    }
    # [END pass_token]

    return flask.render_template('count_lobby.html', **template_values)

#[START testing section]
@app.route('/count')
def new_model():
    """
    The main entrypoint of the counting application
    Controls creating and joining games
    """
    logging.info("Main Counter Introduction")
    user = users.get_current_user()

    key = request.args.get('g')

    if not key:
        #Create a new game
        key = user.user_id()
        counter = Counter(id = key, recentUser = user, count = 0, users = [user])
        counter.put()
    else:
        counter = Counter.get_by_id(key)
        if not counter:
            return 'No Such Counter', 404
        if not user in counter.users:
            counter.users.append(user)
            counter.put()


    channel_id = user.user_id() + key

    #Support joining with an id in the url

    logging.info("I should only see this once")

    #Create a new counter if one doesn't already exist
       

    # [START pass_token]
    client_auth_token = create_custom_token(channel_id)
    _send_firebase_message(channel_id, message=counter.to_json())

    game_link = '{}?g={}'.format(request.base_url, key)

    template_values = {
        'token': client_auth_token,
        'channel_id': channel_id,
        'me': user.user_id(),
        'game_key': key,
        'game_link': game_link,
        'initial_message': urllib.unquote(counter.to_json())
    }
    # [END pass_token]

    return flask.render_template('count_index.html', **template_values)

@app.route("/where")
def where():
    return request.base_url

# [START route_delete]
@app.route('/count/delete', methods=['POST'])
def my_delete():
    """
    NOT CURRENTLY CALLED
    Called to remove the record from the database
    """
    game = Counter.get_by_id(request.args.get('g'))
    if not game:
        return 'Game not found', 400
    user = users.get_current_user()
    _send_firebase_message(user.user_id() + game.key.id(), message=None)
    return ''
# [END route_delete]

@app.route('/count/open', methods=['POST'])
def my_opened():
    """
    This is called when the initial channel is opened
    """
    logging.info("Opening Counter Channel")
    logging.info(request.args.get('g'))
    game = Counter.get_by_id(request.args.get('g'))
    if not game:
        return 'Game not found', 400
    game.send_update()
    return ''

@app.route('/count/up', methods=['POST'])
def my_count_up():
    """
    Handles a web request to increase the count
    """
    logging.info("Counting Up")
    game = Counter.get_by_id(request.args.get('g'))
    if not game:
        logging.debug("Game not found! " + request.args.get('g'))
        return 'Game not found, or invalid position', 400
    game.add(users.get_current_user())
    return ''


@app.route('/count-lobby/add', methods=['POST'])
def my_lobby_add():
    """
    Handles a web request to increase the count
    """
    logging.info("Attempting to add a user")
    lobby = Counter.get_by_id(request.args.get('g'))
    if not lobby:
        logging.debug("Game not found! " + request.args.get('g'))
        return 'Game not found, or invalid position', 400
    lobby.add_user(users.get_current_user())
    lobby.send_update()
    return ''


# [END testing_section]
