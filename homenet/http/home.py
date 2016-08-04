from .router import router
import homenet.db as db

@router.route('home', '/', tpl='home.jinja2')
def home(ctx):
    return {
        'articles': ctx.db.query(db.Article)
    }
    #html = ''
    #for article in ctx.db.query(db.Article):
    #    url = ctx.url('article', article)
    #    html += '<a href="%s">%s</a><br>' % (url, article.title)
    #return html
