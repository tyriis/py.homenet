from ..router import router
import homenet.db as db
import json

@router.route('rest/locations', '/rest/locations')
def locations(ctx):
    ctx.http.response.content_type = 'application/json'
    if ctx.http.request.method == 'POST':
        location = db.Location.from_dict(ctx, ctx.http.request.POST)
        return location.as_JSON()
    return db.Location.get_full_json(ctx)

@router.route('rest/location', '/rest/locations/{location.id}')
def location(ctx, location: db.Location):
    ctx.http.response.content_type = 'application/json'
    return location.as_JSON()


