import logging
import flask

from firebase_interface import _send_firebase_message, create_custom_token
from gaesessions import get_current_session
from game.model import GameState, TileEntity
import urllib

from flask import request

r_game = flask.Blueprint('game', __name__, template_folder='templates')

game_id = 1
player_id = 1


def create_game_session():
    """
    Creates or retrieves the counter and sets the session state
    :return:
    returns template values that can be passed to the render_template
    method
    """
    global game_id
    global player_id
    logging.info("Create a new session for a game")

    # Check if a session already exists, create it if it doesn't
    session = get_current_session()
    user = session.get("id", 0)
    if user == 0:
        session["id"] = str(player_id)
        user = session["id"]
        player_id += 1

    # user = users.get_current_user()

    key = request.args.get('g')

    if not key:
        # Create a new game
        key = session["id"]

        ships = [
            TileEntity(type=user, row=0, col=0)
        ]

        my_game = GameState(id=key, tiles=ships, users=[user])
        my_game.put()
    else:
        my_game = GameState.get_by_id(key)
        if not my_game:
            return 'No Such Counter', 404
        if user not in my_game.users:
            my_game.users.append(user)
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


@r_game.route("/game/move", methods=['POST'])
def game_move():
    """
    Handle the moving logic from the game
    :return:
    """
    logging.info(request)
    game = GameState.get_by_id(request.args.get('g'))
    game.send_update("move")
    return ''

