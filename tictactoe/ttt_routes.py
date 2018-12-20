from flask import Blueprint

import json
import os
import re
import time
import urllib

import logging

from firebase_interface import _send_firebase_message, create_custom_token

from tictactoe_model import Game

import flask
from flask import request
# from google.appengine.api import app_identity
from google.appengine.api import users
from google.appengine.ext import ndb
# import httplib2
# from oauth2client.client import GoogleCredentials

ttt = Blueprint('tictactoe', __name__, template_folder='templates')

# [START move_route]
@ttt.route('/move', methods=['POST'])
def move():
    game = Game.get_by_id(request.args.get('g'))
    position = int(request.form.get('i'))
    if not (game and (0 <= position <= 8)):
        return 'Game not found, or invalid position', 400
    game.make_move(position, users.get_current_user())
    return ''
# [END move_route]


# [START route_delete]
@ttt.route('/delete', methods=['POST'])
def delete():
    game = Game.get_by_id(request.args.get('g'))
    if not game:
        return 'Game not found', 400
    user = users.get_current_user()
    _send_firebase_message(user.user_id() + game.key.id(), message=None)
    return ''
# [END route_delete]


@ttt.route('/opened', methods=['POST'])
def opened():
    game = Game.get_by_id(request.args.get('g'))
    if not game:
        return 'Game not found', 400
    game.send_update()
    return ''


@ttt.route('/')
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

@ttt.route('/test')
def test_me():
    """Just for me to test things"""
    user = users.get_current_user()
    game_key = user.user_id()
    game = Game.get_by_id(game_key)
    if not game:
        return 'No such game', 404
    else:
        return game.to_json()