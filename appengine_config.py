import os.path

from google.appengine.ext import vendor
from server.gaesessions import SessionMiddleware


# Add any libraries installed in the "lib" folder.
vendor.add('lib')

# Patch os.path.expanduser. This should be fixed in GAE
# versions released after Nov 2016.
os.path.expanduser = lambda path: path

#Add local path


def webapp_add_wsgi_middleware(app):
    app = SessionMiddleware(app, cookie_key="SomeSimpleButRandomAndLongGobbledeygook")
    return app
