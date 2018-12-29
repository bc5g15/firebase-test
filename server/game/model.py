from google.appengine.ext import ndb
import json
from ..firebase_interface import _send_firebase_message
import logging
import random

"""
This file stores the models used for storing the
game state in the firebase database
"""


class TileEntity(ndb.Model):
    """
    Stores the type and position of an item on a tile
    """
    type = ndb.StringProperty()
    row = ndb.IntegerProperty()
    col = ndb.IntegerProperty()

    def to_json(self):
        return json.dumps(self.to_dict())


class GameState(ndb.Model):
    """
    Stores the state of the game
    """
    tiles = ndb.StructuredProperty(TileEntity, repeated=True)
    users = ndb.StringProperty(repeated=True)

    def to_json(self):
        return json.dumps(self.to_dict())

    def send_update(self, token):
        """
        Send an update to the server when the
        state of the game changes
        :return:
        """
        mdict = self.to_dict()
        mdict["token"] = token
        message = json.dumps(mdict)
        for u in self.users:
            _send_firebase_message(
                u + self.key.id(), message=message
            )

    def send_small_update(self, token, tile):
        """
        Send the information of a single tile
        The relevant user is always updated first
        :param token:
        :param tile:
        :return:
        """
        mdict = tile.to_dict()
        mdict["token"] = token
        message = json.dumps(mdict)
        _send_firebase_message(
            tile.type + self.key.id(), message=message
        )

        for u in self.users:
            if not u == tile.type:
                _send_firebase_message(
                    u + self.key.id(), message=message
                )

    def notify_user_position(self, user_id):
        logging.info("Do something...")
        for x in self.tiles:
            logging.info("Compare...")
            logging.info(x.type)
            logging.info(user_id)
            if x.type == user_id:
                mdict = self.to_dict()
                mdict["token"] = "position"
                message = json.dumps(mdict)
                _send_firebase_message(
                    x.type + self.key.id(), message=message
                )

    def notify_add_user(self, user):
        """
        A special notification method
        that just sends the details
        of a new user
        :param user:
        :return:
        """
        mdict = user.to_dict()
        mdict["token"] = "new_user"
        message = json.dumps(mdict)
        for u in self.users:
            _send_firebase_message(
                u + self.key.id(), message=message
            )

        """
        Now send the full state to the new user
        """
        mdict = self.to_dict()
        mdict["token"] = "position"
        message = json.dumps(mdict)
        _send_firebase_message(
            user.type + self.key.id(), message=message
        )

    def add_user(self, user_id, row, col):
        """
        Add the user to the state and add a new location
        on the grid
        :param user_id:
        :param row:
        :param col:
        :return:
        """
        if user_id not in self.users:
            self.users.append(user_id)
        new_user = TileEntity(type=user_id, row=row, col=col)
        self.tiles.append(new_user)
        self.put()
        self.notify_add_user(new_user)
        # else:
        #     logging.info("Existing user attempting to join!")

    def move(self, user_id, new_row, new_col):
        """
        Currently a very inefficient moving algorithm
        :param user_id:
        :param new_row:
        :param new_col:
        :return:
        """
        for x in xrange(len(self.tiles)):
            logging.info(x)
            logging.info(user_id)
            logging.info(self.tiles[x].type)
            if self.tiles[x].type == user_id:
                logging.info("Update")
                self.tiles[x].row = int(new_row)
                self.tiles[x].col = int(new_col)
                self.put()
                self.send_small_update("move", self.tiles[x])
                return

        # for tile in self.tiles:
        #     logging.info(tile.type)
        #     if tile.type == user_id:
        #
        #         tile.row = new_row
        #         tile.col = new_col

        # self.send_update("move")

    def list_users(self):
        return map(lambda x: x.type, self.tiles)

    def full_tiles(self):
        return map(lambda x: (x.row, x.col), self.tiles)

    def random_empty_position(self):
        done = False
        nrow = 0
        ncol = 0
        while not done:
            nrow = random.randint(0, 7)
            ncol = random.randint(0, 7)

            if (nrow, ncol) not in self.full_tiles():
                done = True
        return nrow, ncol