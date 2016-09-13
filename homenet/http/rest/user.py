from ..router import router
from homenet import db
import json
from datetime import datetime

@router.route('rest/users', '/rest/users')
def users(ctx):
    ctx.http.response.content_type = 'application/json'
    if ctx.http.request.method == 'POST':
        user = db.User.from_dict(ctx, ctx.http.request.POST)
        return user.as_JSON()
    return db.User.get_full_json(ctx)

@router.route('rest/user', '/rest/users/{user.id}')
def user(ctx, user: db.User):
    ctx.http.response.content_type = 'application/json'
    return user.as_JSON()


@router.route('rest/user/_update_password', '/rest/users/{user.id}/_update_password')
def update_password(ctx, user: db.User, password, new_password):
    ctx.http.response.content_type = 'application/json'
    if not user.verify_password(password):
        return false
    if not new_password:
        return false
    user.password = new_password
    user.persist_hash = None
    return True

@update_password.match2vars
def update_password_match2vars(ctx, matches):
    user = ctx.db.query(db.User).get(matches['user.id'])
    assert isinstance(user, db.User), 'first arg must be of type db.User'
    assert ctx.http.request.method == 'POST', 'only POST request allowed'
    assert 'password' in ctx.http.request.POST, 'current password required'
    assert 'new_password' in ctx.http.request.POST, 'new password required'
    return {
        'user': user,
        'password': ctx.http.request.POST['password'],
        'new_password': ctx.http.request.POST['new_password']
    }


#@update_password.vars2urlparts
#def update_password_vars2urlparts(ctx, user: db.User):
#    return {
#        'user.id': user.id,
#    }

