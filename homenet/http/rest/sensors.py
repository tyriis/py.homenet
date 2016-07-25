from ..router import router
import homenet.db as db
import json

@router.route('rest/sensors', '/rest/sensors')
def sensors(ctx):
    ctx.http.response.content_type = 'application/json'
    if ctx.http.request.method == 'POST':
        sensor = db.Sensor.from_dict(ctx, ctx.http.request.POST)
        return sensor.as_JSON()
    return db.Sensor.get_full_json(ctx)

@router.route('rest/sensor', '/rest/sensors/{sensor.id}')
def sensor(ctx, sensor: db.Sensor):
    ctx.http.response.content_type = 'application/json'
    return sensor.as_JSON()

