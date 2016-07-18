from .router import router
import homenet.db as db

@router.route('home', '/')
def home(ctx):
    html = ''
    for article in ctx.db.query(db.Article):
        url = ctx.url('article', article)
        html += '<a href="%s">%s</a><br>' % (url, article.title)
    return html
