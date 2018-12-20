# Copyright 2016 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Tic Tac Toe with the Firebase API"""

import base64
try:
    from functools import lru_cache
except ImportError:
    from functools32 import lru_cache
import json
import os
import re
import time
import urllib

import logging

from firebase_interface import _send_firebase_message

from flask import request
from google.appengine.ext import ndb


_X_WIN_PATTERNS = [
    'XXX......', '...XXX...', '......XXX', 'X..X..X..', '.X..X..X.',
    '..X..X..X', 'X...X...X', '..X.X.X..']
_O_WIN_PATTERNS = map(lambda s: s.replace('X', 'O'), _X_WIN_PATTERNS)

X_WINS = map(lambda s: re.compile(s), _X_WIN_PATTERNS)
O_WINS = map(lambda s: re.compile(s), _O_WIN_PATTERNS)

class Game(ndb.Model):
    """All the data we store for a game"""
    userX = ndb.UserProperty()
    userO = ndb.UserProperty()
    board = ndb.StringProperty()
    moveX = ndb.BooleanProperty()
    winner = ndb.StringProperty()
    winning_board = ndb.StringProperty()

    def to_json(self):
        d = self.to_dict()
        d['winningBoard'] = d.pop('winning_board')
        return json.dumps(d, default=lambda user: user.user_id())

    def send_update(self):
        """Updates Firebase's copy of the board."""
        logging.info("Sending TTT state update")
        message = self.to_json()
        # send updated game state to user X
        _send_firebase_message(
            self.userX.user_id() + self.key.id(), message=message)
        # send updated game state to user O
        if self.userO:
            _send_firebase_message(
                self.userO.user_id() + self.key.id(), message=message)

    def _check_win(self):
        if self.moveX:
            # O just moved, check for O wins
            wins = O_WINS
            potential_winner = self.userO.user_id()
        else:
            # X just moved, check for X wins
            wins = X_WINS
            potential_winner = self.userX.user_id()

        for win in wins:
            if win.match(self.board):
                self.winner = potential_winner
                self.winning_board = win.pattern
                return

        # In case of a draw, everyone loses.
        if ' ' not in self.board:
            self.winner = 'Noone'

    def make_move(self, position, user):
        # If the user is a player, and it's their move
        if (user in (self.userX, self.userO)) and (
                self.moveX == (user == self.userX)):
            boardList = list(self.board)
            # If the spot you want to move to is blank
            if (boardList[position] == ' '):
                boardList[position] = 'X' if self.moveX else 'O'
                self.board = ''.join(boardList)
                self.moveX = not self.moveX
                self._check_win()
                self.put()
                self.send_update()
                return
