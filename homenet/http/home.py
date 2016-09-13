from .router import router
import homenet.db as db

@router.route('home', '/', tpl='home.jinja2')
def home(ctx):
    if ctx.user:
        return {}
    if 'persist' in ctx.http.request.cookies:
        user = ctx.db.query(db.User).\
                filter(db.User.persist_hash == ctx.http.request.cookies['persist']).\
                first()
        if user:
            ctx.user = user
            return {}
    render = ctx.score.tpl.renderer.render_file
    return render(ctx, 'login.jinja2')
