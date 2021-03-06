from ..router import router
from homenet import db
import json
from datetime import datetime

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

@router.route('rest/sensor/actions', '/rest/sensors/{sensor.id}/actions/{mode}')
def sensor_actions(ctx, sensor: db.Sensor, mode):
    ctx.http.response.content_type = 'application/json'
    if mode == 'day':
        data = [action.as_dict() for action in sensor.daily_actions]
        return json.dumps(data, sort_keys=True, indent=4, separators=(',', ': '))

@sensor_actions.match2vars
def sensor_actions_match2vars(ctx, matches):
    sensor = ctx.db.query(db.Sensor).get(matches['sensor.id'])
    assert isinstance(sensor, db.Sensor), 'first arg must be of type db.Sensor'
    return {
        'sensor': sensor,
        'mode': matches['mode']
    }


@sensor_actions.vars2urlparts
def sensor_actions_vars2urlparts(ctx, sensor: db.Sensor, mode):
    return {
        'sensor.id': sensor.id,
        'mode': mode,
    }

@router.route('rest/sensor/actions/date', '/rest/sensors/{sensor.id}/actions/date/{date>\d\d\d\d-\d\d-\d\d}')
def sensor_date_actions(ctx, sensor: db.Sensor, date: datetime):
    ctx.http.response.content_type = 'application/json'
    data = [action.as_dict() for action in sensor.date_actions(date)]
    return json.dumps(data, sort_keys=True, indent=4, separators=(',', ': '))

@sensor_date_actions.match2vars
def senor_date_actions_match2vars(ctx, matches):
    sensor = ctx.db.query(db.Sensor).get(matches['sensor.id'])
    assert isinstance(sensor, db.Sensor), 'first arg must be of type db.Sensor'
    date = datetime.strptime(matches['date'], '%Y-%m-%d').date()
    return {
        'sensor': sensor,
        'date': date
    }

@sensor_date_actions.vars2urlparts
def sensor_date_actions_vars2urlparts(ctx, sensor: db.Sensor, date: datetime):
    return {
        'sensor.id': sensor.id,
        'date': date
    }

