from ..router import router
import homenet.db as db
import json

@router.route('rest/sensors', '/rest/sensors')
def locations(ctx):
    ctx.http.response.content_type = 'application/json'
    sensors = ctx.db.query(db.Sensor).all()
    data = [sensor.as_dict() for sensor in sensors]
    return json.dumps(data, sort_keys=True, indent=4, separators=(',', ': '))

@router.route('rest/sensor', '/rest/sensors/{sensor.id}')
def location(ctx, sensor: db.Sensor):
    ctx.http.response.content_type = 'application/json'
    return json.dumps(sensor.as_dict(), sort_keys=True, indent=4, separators=(',', ': '))

