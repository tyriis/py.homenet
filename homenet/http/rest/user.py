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
        return False
    if not new_password:
        return False
    user.password = new_password
    user.persist_hash = None
    return json.dumps(True)

@update_password.match2vars
def update_password_match2vars(ctx, matches):
    user = ctx.db.query(db.User).get(matches['user.id'])
    assert isinstance(user, db.User), 'first arg must be of type db.User'
    assert ctx.http.request.method == 'POST', 'only POST request allowed'
    data = json.loads(ctx.http.request.body.decode("utf-8"))
    assert 'password' in data, 'current password required'
    assert 'new_password' in data, 'new password required'
    return {
        'user': user,
        'password': data['password'],
        'new_password': data['new_password']
    }

@router.route('rest/user/_update_own_password', '/rest/users/_update_own_password')
def update_own_password(ctx, password, new_password):
    user = ctx.user
    ctx.http.response.content_type = 'application/json'
    if not user.verify_password(password):
        return False
    if not new_password:
        return False
    user.password = new_password
    user.persist_hash = None
    return json.dumps(True)

@update_own_password.match2vars
def update_own_password_match2vars(ctx, matches):
    assert ctx.http.request.method == 'POST', 'only POST request allowed'
    data = json.loads(ctx.http.request.body.decode("utf-8"))
    assert 'password' in data, 'current password required'
    assert 'new_password' in data, 'new password required'
    return {
        'password': data['password'],
        'new_password': data['new_password']
    }

#@update_password.vars2urlparts
#def update_password_vars2urlparts(ctx, user: db.User):
#    return {
#        'user.id': user.id,
#    }

