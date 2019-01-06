from flask import Blueprint
import json
import random
import logging
import os
from typemodel import TypeTask
from ..firebase_interface import _send_firebase_message
from flask import request
from ..gaesessions import get_current_session

loader = Blueprint('loader', __name__, template_folder=os.path.abspath('templates'))
keylist = []
num_entries = 0

MAX_ENTRIES = 200


@loader.route("/loadtemp")
def loadtemp():
    global keylist
    global num_entries
    """
    This should only be run once!
    Loads the test file into the database
    So long as the data kind is in the database
    everything else should be fine
    """
    text = open('server/temp/Difficulties.json', 'r').read()
    records = json.loads(text)
    num_entries = len(records)
    output = []
    index = 1
    for item in records:
        # Forcibly remove untypable UTF-8 characters
        my_in = item["text"].strip().encode("ascii", "ignore")
        tt = TypeTask(id=index, text=my_in, difficulty=item["difficulty"])
        key = tt.put()  # put() returns a key, so I have made sure to store this key in a list of keys that can be used
        #  to find and return TypeTasks later on
        keylist.append(key)
        output.append(my_in)
        index += 1
        if index > MAX_ENTRIES:
            break

    return "Loaded values " + str(output)


def retrieve_task(self, userid):  # Non-route version of get_task to be imported by other functions
    global keylist
    typetaskindex = random.randint(0, len(keylist) - 1)  # Randomly generates a key index from 0 to the maximum value
    # (index is one greater than the length of the list so 2 has to be subtracted from it)
    typetaskkey = keylist[typetaskindex]  # Retrieves the key from the list
    typetask = typetaskkey.get()  # Uses the key to get the corresponding TypeTask from the database
    return typetask


@loader.route("/gettask", methods=["POST"])
def get_task():
    typetaskindex = random.randint(1, MAX_ENTRIES)  # Randomly generates a key index from 0 to the maximum value
    # (index is one greater than the length of the list so 2 has to be subtracted from it)
    typetask = TypeTask.get_by_id(typetaskindex)  # Uses the key to get the corresponding TypeTask from the database
    userid = get_current_session()["id"]
    mdict = typetask.to_dict()
    mdict["token"] = "typechallenge"
    message = json.dumps(mdict)
    logging.info(message)
    _send_firebase_message(userid + request.args.get('g'), message = message);
    return ''