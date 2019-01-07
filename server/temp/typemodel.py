from google.appengine.ext import ndb


class TypeTask(ndb.Model):
    """
    Stores information relevant to typing challenges
    """
    text = ndb.StringProperty()
    difficulty = ndb.IntegerProperty()
