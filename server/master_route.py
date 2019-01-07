
"""Ironclad Typetester developed with the Firebase API"""

import flask


from temp.typeloader import loader
from solo.routes import solo
from game.routes import r_game
from temp.session_debug import sessdebug

# This is the main switchboard of the application
app = flask.Flask(__name__)
app.register_blueprint(loader)
app.register_blueprint(solo)
app.register_blueprint(r_game)
app.register_blueprint(sessdebug)

