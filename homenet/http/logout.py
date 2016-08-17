from .router import router


@router.route('logout', '/logout')
def logout(ctx):
    ctx.user = None
    request = ctx.http.request
    ctx.http.response.status_code = 302
    ctx.http.response.location = '/'
    ctx.http.response.set_cookie('session', '', max_age=0)
    return ctx.http.response
