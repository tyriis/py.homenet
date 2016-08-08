from .router import router
import homenet.db as db

@router.route('home', '/', tpl='home.jinja2')
def home(ctx):
    return {}

