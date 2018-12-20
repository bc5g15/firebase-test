
"""Tic Tac Toe with the Firebase API"""

import flask

from tictactoe.ttt_routes import ttt
from counter.counter_routes import count

app = flask.Flask(__name__)
app.register_blueprint(ttt)
app.register_blueprint(count)