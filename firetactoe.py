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


import flask
from flask import request
from google.appengine.api import app_identity
from google.appengine.api import users
from google.appengine.ext import ndb
import httplib2
from oauth2client.client import GoogleCredentials
# from oauth2client.service_account import ServiceAccountCredentials

# pathf variable for private key file

_FIREBASE_CONFIG = '_firebase_config.html'

_IDENTITY_ENDPOINT = ('https://identitytoolkit.googleapis.com/'
                      'google.identity.identitytoolkit.v1.IdentityToolkit')
_FIREBASE_SCOPES = [
    'https://www.googleapis.com/auth/firebase.database',
    'https://www.googleapis.com/auth/userinfo.email']

_X_WIN_PATTERNS = [
    'XXX......', '...XXX...', '......XXX', 'X..X..X..', '.X..X..X.',
    '..X..X..X', 'X...X...X', '..X.X.X..']
_O_WIN_PATTERNS = map(lambda s: s.replace('X', 'O'), _X_WIN_PATTERNS)

X_WINS = map(lambda s: re.compile(s), _X_WIN_PATTERNS)
O_WINS = map(lambda s: re.compile(s), _O_WIN_PATTERNS)


app = flask.Flask(__name__)

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

"""
AFTER THIS POINT IS TIC-TAC-TOE CODE
"""

class Game(ndb.Model):
    """All the data we store for a game"""
    userX = ndb.UserProperty()
    userO = ndb.UserProperty()
    board = ndb.StringProperty()
    moveX = ndb.BooleanProperty()
    winner = ndb.StringProperty()
    winning_board = ndb.StringProperty()

    def to_json(self):
        d = self.to_dict()
        d['winningBoard'] = d.pop('winning_board')
        return json.dumps(d, default=lambda user: user.user_id())

    def send_update(self):
        """Updates Firebase's copy of the board."""
        logging.info("Sending TTT state update")
        message = self.to_json()
        # send updated game state to user X
        _send_firebase_message(
            self.userX.user_id() + self.key.id(), message=message)
        # send updated game state to user O
        if self.userO:
            _send_firebase_message(
                self.userO.user_id() + self.key.id(), message=message)

    def _check_win(self):
        if self.moveX:
            # O just moved, check for O wins
            wins = O_WINS
            potential_winner = self.userO.user_id()
        else:
            # X just moved, check for X wins
            wins = X_WINS
            potential_winner = self.userX.user_id()

        for win in wins:
            if win.match(self.board):
                self.winner = potential_winner
                self.winning_board = win.pattern
                return

        # In case of a draw, everyone loses.
        if ' ' not in self.board:
            self.winner = 'Noone'

    def make_move(self, position, user):
        global myNumber
        myNumber += 1
        logging.info("My number is: " + str(myNumber))
        # If the user is a player, and it's their move
        if (user in (self.userX, self.userO)) and (
                self.moveX == (user == self.userX)):
            boardList = list(self.board)
            # If the spot you want to move to is blank
            if (boardList[position] == ' '):
                boardList[position] = 'X' if self.moveX else 'O'
                self.board = ''.join(boardList)
                self.moveX = not self.moveX
                self._check_win()
                self.put()
                self.send_update()
                return


# [START move_route]
@app.route('/move', methods=['POST'])
def move():
    game = Game.get_by_id(request.args.get('g'))
    position = int(request.form.get('i'))
    if not (game and (0 <= position <= 8)):
        return 'Game not found, or invalid position', 400
    game.make_move(position, users.get_current_user())
    return ''
# [END move_route]


# [START route_delete]
@app.route('/delete', methods=['POST'])
def delete():
    game = Game.get_by_id(request.args.get('g'))
    if not game:
        return 'Game not found', 400
    user = users.get_current_user()
    _send_firebase_message(user.user_id() + game.key.id(), message=None)
    return ''
# [END route_delete]


@app.route('/opened', methods=['POST'])
def opened():
    game = Game.get_by_id(request.args.get('g'))
    if not game:
        return 'Game not found', 400
    game.send_update()
    return ''


@app.route('/')
def main_page():
    """Renders the main page. When this page is shown, we create a new
    channel to push asynchronous updates to the client."""
    user = users.get_current_user()
    game_key = request.args.get('g')

    if not game_key:
        game_key = user.user_id()
        game = Game(id=game_key, userX=user, moveX=True, board=' '*9)
        game.put()
    else:
        game = Game.get_by_id(game_key)
        if not game:
            return 'No such game', 404
        if not game.userO:
            game.userO = user
            game.put()

    # [START pass_token]
    # choose a unique identifier for channel_id
    channel_id = user.user_id() + game_key
    # encrypt the channel_id and send it as a custom token to the
    # client
    # Firebase's data security rules will be able to decrypt the
    # token and prevent unauthorized access
    client_auth_token = create_custom_token(channel_id)
    _send_firebase_message(channel_id, message=game.to_json())

    # game_link is a url that you can open in another browser to play
    # against this player
    game_link = '{}?g={}'.format(request.base_url, game_key)

    # push all the data to the html template so the client will
    # have access
    template_values = {
        'token': client_auth_token,
        'channel_id': channel_id,
        'me': user.user_id(),
        'game_key': game_key,
        'game_link': game_link,
        'initial_message': urllib.unquote(game.to_json())
    }

    return flask.render_template('fire_index.html', **template_values)
   
# [END pass_token]

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
