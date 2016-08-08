from .router import router
import homenet.db as db

@router.route('home', '/', tpl='home.jinja2')
def home(ctx):
    if ctx.user:
        return {}
    render = ctx.score.tpl.renderer.render_file
    return render(ctx, 'login.jinja2')
