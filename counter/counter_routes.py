from flask import Blueprint
from counter.model import Counter
from gaesessions import get_current_session

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
# from google.appengine.api import app_identity
# from google.appengine.api import users
# from google.appengine.ext import ndb
# import httplib2
# from oauth2client.client import GoogleCredentials

count = Blueprint('counter', __name__, template_folder='templates')

next_id = 1


def create_counter_session():
    """
    Creates or retrieves the counter and sets the session state
    :return:
    returns template values that can be passed to the render_template
    method
    """
    global next_id
    logging.info("Create a new session for a counter")

    # Check if a session already exists, create it if it doesn't
    session = get_current_session()
    user = session.get("id", 0)
    if user == 0:
        session["id"] = str(next_id)
        user = session["id"]
        next_id += 1

    # user = users.get_current_user()

    key = request.args.get('g')

    if not key:
        # Create a new game
        key = session["id"]

        counter = Counter(id=key, recentUser=user, count=0, users=[user])
        counter.put()
    else:
        counter = Counter.get_by_id(key)
        if not counter:
            return 'No Such Counter', 404
        if user not in counter.users:
            counter.users.append(user)
            counter.put()

    channel_id = user + key

    # [START pass_token]
    client_auth_token = create_custom_token(channel_id)
    _send_firebase_message(channel_id, message=counter.to_json())

    game_link = '{}?g={}'.format(request.base_url, key)

    template_values = {
        'token': client_auth_token,
        'channel_id': channel_id,
        'me': user,
        'game_key': key,
        'game_link': game_link,
        'initial_message': urllib.unquote(counter.to_json())
    }
    # [END pass_token]

    return template_values


@count.route('/count-lobby')
def new_lobby():
    logging.info("Main Lobby introduction")

    template_values = create_counter_session()

    return flask.render_template('count_lobby.html', **template_values)

# [START testing section]


@count.route('/count')
def new_model():
    """
    The main entrypoint of the counting application
    Controls creating and joining games
    """
    logging.info("Main Counter Introduction")

    template_values = create_counter_session()

    return flask.render_template('count_index.html', **template_values)


@count.route("/where")
def where():
    return request.base_url

# [START route_delete]


@count.route('/count/delete', methods=['POST'])
def my_delete():
    """
    NOT CURRENTLY CALLED
    Called to remove the record from the database
    """
    game = Counter.get_by_id(request.args.get('g'))
    if not game:
        return 'Game not found', 400
    _send_firebase_message(get_current_session()["id"] + game.key.id(), message=None)
    return ''
# [END route_delete]


@count.route('/count/open', methods=['POST'])
def my_opened():
    """
    This is called when the initial channel is opened
    """
    logging.info("Opening Counter Channel")
    logging.info(request.args.get('g'))
    game = Counter.get_by_id(request.args.get('g'))
    if not game:
        logging.info("Bad things!")
        return 'Game not found', 400
    game.send_update()
    return ''


@count.route('/count/up', methods=['POST'])
def my_count_up():
    """
    Handles a web request to increase the count
    """
    logging.info("Counting Up")
    game = Counter.get_by_id(request.args.get('g'))
    if not game:
        logging.debug("Game not found! " + request.args.get('g'))
        return 'Game not found, or invalid position', 400
    game.add(str(get_current_session()["id"]))
    return ''


# @count.route('/count-lobby/add', methods=['POST'])
# def my_lobby_add():
#     """
#     Handles a web request to increase the count
#     """
#     logging.info("Attempting to add a user")
#     lobby = Counter.get_by_id(request.args.get('g'))
#     if not lobby:
#         logging.debug("Game not found! " + request.args.get('g'))
#         return 'Game not found, or invalid position', 400
#     lobby.add_user()
#     lobby.send_update()
#     return ''


# [END testing_section]
