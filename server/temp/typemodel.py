from google.appengine.ext import ndb


class TypeTask(ndb.Model):
    """
    Represents the database state of a
    typing task
    """
    text = ndb.StringProperty()
    difficulty = ndb.IntegerProperty()