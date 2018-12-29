from flask import Blueprint
import json
import random
import logging
from temp.typemodel import TypeTask

loader = Blueprint('loader', __name__, template_folder='templates')
keylist = []


@loader.route("/loadtemp")
def loadtemp():
    global keylist
    """
    This should only be run once!
    Loads the test file into the database
    So long as the data kind is in the database
    everything else should be fine
    """
    text = open('temp/Difficulties.json', 'r').read()
    records = json.loads(text)
    index = 1
    for item in records:
        logging.info(item)
        # mytext= item["text"]
        # mydifficulty = item["difficulty"]
        tt = TypeTask(id=index, text=item["text"], difficulty=item["difficulty"])  # No headers "text" or "difficulty"
        # at the moment
        key = tt.put()  # put() returns a key, so I have made sure to store this key in a list of keys that can be used
        #  to find and return TypeTasks later on
        keylist.append(key)
        index += 1

    return "Loaded values " + str(records)


def retrieve_task():  # Non-route version of get_task to be imported by other functions
    global keylist
    typetaskindex = random.randint(0, len(keylist) - 1)  # Randomly generates a key index from 0 to the maximum value
    # (index is one greater than the length of the list so 2 has to be subtracted from it)
    typetaskkey = keylist[typetaskindex]  # Retrieves the key from the list
    typetask = typetaskkey.get()  # Uses the key to get the corresponding TypeTask from the database
    return typetask


@loader.route("/gettask")
def get_task():
    global keylist
    typetaskindex = random.randint(0, len(keylist) - 1)  # Randomly generates a key index from 0 to the maximum value
    # (index is one greater than the length of the list so 2 has to be subtracted from it)
    typetaskkey = keylist[typetaskindex]  # Retrieves the key from the list
    typetask = typetaskkey.get()  # Uses the key to get the corresponding TypeTask from the database
    return str(typetask)
