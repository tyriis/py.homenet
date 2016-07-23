from ..router import router
import homenet.db as db
import json

@router.route('rest/locations', '/rest/locations')
def locations(ctx):
    ctx.http.response.content_type = 'application/json'
    locations = ctx.db.query(db.Location).all()
    data = list()
    for location in locations:
        data.append(location.as_dict())
    return json.dumps(data, sort_keys=True, indent=4, separators=(',', ': '))

@router.route('rest/location', '/rest/locations/{location.id}')
def location(ctx, location: db.Location):
    ctx.http.response.content_type = 'application/json'
    return json.dumps(location.as_dict(), sort_keys=True, indent=4, separators=(',', ': '))

