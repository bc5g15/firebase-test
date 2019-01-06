from flask import Blueprint
from ..gaesessions import get_current_session
import os

sess = Blueprint('sessions', __name__, template_folder=os.path.abspath('templates'))


@sess.route('/sets/<int:value>')
def set_sess_var(value):
    session = get_current_session()
    session['key'] = value

    return "Session key set to " + str(value)


@sess.route('/gets')
def get_sess_var():
    session = get_current_session()
    return str(session.get('key', 'not set'))
