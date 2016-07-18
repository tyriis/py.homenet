from .router import router
import homenet.db as db
from docutils.core import publish_parts


@router.route('article', '/article/{article.id}')
def article(ctx, article: db.Article):
    body = publish_parts(article.body, writer_name='html')['body']
    return '''
        <div style="max-width:800px">
            <h1 style="font-size:2em">%s</h1>
            <div style="font-size:1.5em">%s</div>
            <div>%s</div>
        </div>
    ''' % (article.title, article.teaser, body)
