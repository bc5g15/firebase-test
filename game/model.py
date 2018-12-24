from google.appengine.ext import ndb
import json
from firebase_interface import _send_firebase_message
import logging

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
            self.tiles.append(TileEntity(type=user_id, row=row, col=col))
            self.put()
            self.send_update("user_add")

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

        # for tile in self.tiles:
        #     logging.info(tile.type)
        #     if tile.type == user_id:
        #
        #         tile.row = new_row
        #         tile.col = new_col

        self.put()
        self.send_update("move")
