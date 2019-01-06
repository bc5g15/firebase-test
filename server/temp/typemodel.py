from google.appengine.ext import ndb

class TypeTask(ndb.Model):
    text = ndb.StringProperty()
    difficulty = ndb.IntegerProperty()