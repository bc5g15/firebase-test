import logging
import flask
import os

from ..firebase_interface import _send_firebase_message, create_custom_token
from ..gaesessions import get_current_session
from model import GameState
import urllib

from ..build_ids import *

from flask import request

r_game = flask.Blueprint('game', __name__, template_folder=os.path.abspath('templates'))

# game_id = 1
# player_id = 1


def create_game_session():
    """
    Creates or retrieves the counter and sets the session state
    :return:
    returns template values that can be passed to the render_template
    method
    """
    logging.info("Create a new session for a game")

    # Check if a session already exists, create it if it doesn't
    session = get_current_session()
    user = session.get("id", 0)
    if user == "0":
        session["id"] = str(new_user_id())
        user = session["id"]

    # user = users.get_current_user()

    key = request.args.get('g')

    if not key:
        # Create a new game
        key = session["id"]

        my_game = GameState(id=key, tiles=[], users=[user])
        my_game.put()
    else:
        my_game = GameState.get_by_id(key)
        if not my_game:
            return 'No Such Game', 404
        if user not in my_game.users:
            my_game.users.append(user)
            # my_game.add_user(user)
            my_game.put()

    channel_id = user + key

    # [START pass_token]
    client_auth_token = create_custom_token(channel_id)
    _send_firebase_message(channel_id, message=my_game.to_json())

    game_link = '{}?g={}'.format(request.base_url, key)

    template_values = {
        'token': client_auth_token,
        'channel_id': channel_id,
        'me': user,
        'game_key': key,
        'game_link': game_link,
        'initial_message': urllib.unquote(my_game.to_json())
    }
    # [END pass_token]

    return template_values


@r_game.route("/game")
def start_game():
    logging.info("Main Game start")
    template_values = create_game_session()
    return flask.render_template("game_index2.html", **template_values)


@r_game.route("/game/open", methods=['POST'])
def open_game():
    """
    Send a message to acknowledge a listener
    :return:
    """
    logging.info("Opening Game Channel")
    logging.info(request)
    game = GameState.get_by_id(request.args.get('g'))
    if not game:
        return 'Game not found', 404
    game.send_update("open")
    return ''


@r_game.route("/game/join", methods=['POST'])
def join_game():
    """
    Called when a new user wants to join an
    existing game
    :return:
    """
    logging.info("Joining Game")
    game = GameState.get_by_id(request.args.get('g'))
    if not game:
        return 'Game not found', 404

    # Get session ID
    """
    A LOT OF THIS SHOULD BE SPLIT TO A DEDICATED
    LOBBY ROUTINE
    """
    session = get_current_session()
    user = session.get("id", 0)
    if user == 0:
        session["id"] = str(new_user_id())
        user = session["id"]
    else:
        update_user_id()

    if user in game.list_users():
        logging.info("User already present")
        game.notify_user_position(user)
        return ''

    # Create a position and stick the user in
    pos = game.random_empty_position()
    game.add_user(session["id"], pos[0], pos[1])
    logging.info("Attempting join")
    return ''


@r_game.route("/game/move", methods=['POST'])
def game_move():
    """
    Handle the moving logic from the game
    :return:
    """
    logging.info(request.form.get('x'))
    my_id = request.form.get('id')
    col = request.form.get('x')
    row = request.form.get('y')
    logging.info("Row: " + str(row))
    logging.info("Col: " + str(col))
    game = GameState.get_by_id(request.args.get('g'))
    game.move(my_id, row, col)
    return ''

