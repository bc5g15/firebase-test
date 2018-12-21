from flask import Blueprint
import json

import logging

from temp.typemodel import TypeTask

loader = Blueprint('loader', __name__, template_folder='templates')

@loader.route("/loadtemp")
def loadtemp():
    """
    This should only be run once!
    Loads the test file into the database
    So long as the data kind is in the database
    everything else should be fine
    """
    index = 1
    text = open('temp/tests.json', 'r').read()
    records = json.loads(text)

    for item in records:
        # logging.info(item)
        # mytext= item["text"]
        # mydifficulty = item["difficulty"]
        tt = TypeTask(id=index, text=item["text"], difficulty=item["difficulty"])
        tt.put()
        index += 1

    return "Loaded values " + str(records) 

@loader.route("/gettask")
def get_task():
    """
    Returns a random typing task from the server
    """
    return "Nothing yet!"