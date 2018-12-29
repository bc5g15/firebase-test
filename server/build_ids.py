"""
This file consolidates the code for generating IDs outside
of any particular route implementation
"""
import logging

next_user = 1
next_game = 1

"""
CHANGE THESE!

User ids need to be an intelligent, but long string
Game ids should be a four-digit pin
"""

def new_user_id():
    global next_user
    output = next_user
    logging.info("New user = " + str(output))
    next_user += 1
    return output


def new_game_id():
    global next_game
    output = next_game
    next_game += 1
    return output


def update_user_id():
    global next_user
    next_user += 1