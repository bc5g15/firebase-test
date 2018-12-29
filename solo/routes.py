from flask import Blueprint, render_template
from gaesessions import get_current_session
import random

solo = Blueprint('solo', __name__, template_folder='templates')


def create_id():
    uid = str(random.randint(1, 1000))
    uname = "Player" + str(uid)

    return uid, uname


@solo.route("/")
def start():
    """
    Extract the information from the user session
    Allow the user to change their username
    :return:
    """
    session = get_current_session()

    uid = session.get("id", "0")
    uname = session.get("name", "")

    if uid == "0" or uname == "":
        (uid, uname) = create_id()
        session["id"] = uid
        session["name"] = uname
        assert session["id"] != "0", "Bad id!"
        assert session["name"] != "", "Bad name!"

    template_values = {
        'uid': uid,
        'uname': uname
    }

    return render_template('entry.html', **template_values)


@solo.route('/hello', methods=['GET'])
def my_hello():
    return "Nothing yet!"
