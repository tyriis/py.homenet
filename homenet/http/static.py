from .router import router
import mimetypes
import os
from webob.exc import HTTPNotFound

mimetypes.init()


def static(ctx, path):
    import homenet
    base = os.path.join(homenet.__path__[0], 'static')
    file = os.path.join(base, path)
    if not os.path.commonprefix((base, file)).startswith(base):
        raise HTTPNotFound()
    try:
        ctx.http.response.app_iter = open(file, 'rb')
    except FileNotFoundError:
        raise HTTPNotFound()
    except IsADirectoryError:
        raise HTTPNotFound()
    content_type, content_encoding = mimetypes.guess_type(path, strict=False)
    ctx.http.response.cache_control.max_age = 60 * 60 * 24 #cache 1day
    if content_type:
        ctx.http.response.content_type = content_type
        ctx.http.response.content_encoding = content_encoding
    else:
        ctx.http.response.content_type = 'application/octet-stream'


@router.route('images', '/images/{path>.*}')
def static_images(ctx, path):
    return static(ctx, "images/" + path)

