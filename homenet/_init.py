from score.init import ConfiguredModule
from homenet.mqtt import subscribe
from score.auth import Authenticator
from . import db

defaults = {
}


def init(confdict, db, ctx, mqtt):
    """
    Initializes this module acoording to the :ref:`SCORE module initialization
    guidelines <module_initialization>` with the following configuration keys:
    """
    conf = defaults.copy()
    conf.update(confdict)
    subscribe(ctx, mqtt)
    return ConfiguredHomenetModule()


class ConfiguredHomenetModule(ConfiguredModule):

    def __init__(self):
        import homenet
        super().__init__(homenet)

def login_preroute(ctx):
    if ctx.http.request.method == 'POST':
        # the next line will cause the auth-module to log in
        ctx.user


class LoginAuthenticator(Authenticator):

    def retrieve(self, ctx):
        user = self._perform_login(ctx)
        if user:
            return user
        else:
            # the login was not successful, ask the next authenticator to
            # retrieve the current user.
            return self.next.retrieve(ctx)

    def _perform_login(self, ctx):
        if not hasattr(ctx, 'http'):
            return None
        if 'username' not in ctx.http.request.POST:
            return None
        if 'password' not in ctx.http.request.POST:
            return None
        username = ctx.http.request.POST['username']
        user = ctx.db.query(db.User).\
            filter(db.User.username.ilike(username)).\
            first()
        if not user:
            return None
        if not user.verify_password(ctx.http.request.POST['password']):
            return None
        if 'persist' in ctx.http.request.POST:
            persist = user.get_persist_hash(ctx, False)
        ctx.http.response.set_cookie('persist', persist, max_age=(60 * 60 * 24 * 365))
        # we have a logged in user, so pass it to all subsequent
        # authenticators to allow them storing the value.
        self.next.store(ctx, user)
        return user

