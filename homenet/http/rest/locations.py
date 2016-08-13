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



@router.route('rest/location/sensors', '/rest/locations/{location.id}/sensors')
def location_sensors(ctx, location: db.Location):
    ctx.http.response.content_type = 'application/json'
    node_ids = list(map(lambda n: n.id, location.nodes))
    sensors = ctx.db.query(db.Sensor).\
            filter(db.Sensor.node_id.in_(node_ids))
    data = [sensor.as_dict() for sensor in sensors]
    return json.dumps(data, sort_keys=True, indent=4, separators=(',', ': '))

