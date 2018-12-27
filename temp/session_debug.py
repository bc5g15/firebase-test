from flask import Blueprint
import logging
from gaesessions import get_current_session

sessdebug = Blueprint('Session Debug', __name__, template_folder='templates')

@sessdebug.route('/clearsession')
def clear_session():
    """
    This clears the id number of a session
    back to an invalid value
    :return:
    """
    session = get_current_session()
    session["id"] = 0
    return "Session Cleared"
