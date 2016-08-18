import homenet.db as db
import json
from datetime import datetime
import logging

log = logging.getLogger(__name__)

def msg_handler(ctx, msg):
    topic_parts = msg.topic.split('/')
    if topic_parts[0] == 'node':
        visit_node(ctx, msg, topic_parts)

def visit_node(ctx, msg, topic_parts):
    node_id = topic_parts[1]
    node = ctx.db.query(db.Node).get(node_id)
    data = json.loads(msg.payload.decode('utf-8'))
    now = datetime.now();
    ref_time = datetime(now.year, now.month, now.day, now.hour, now.minute, 0)
    if 'sensor' in data.keys():
        sensors = ctx.db.query(db.Sensor).\
            filter(db.Sensor.node == node).\
            filter(db.Sensor.name == data['sensor'])
        for sensor in sensors:
            if sensor.key in data.keys():
                last_action = sensor.last_action
                action = db.SensorAction(sensor=sensor)
                if last_action.time > ref_time:
                    action = last_action
                    action.time = now
                action.value=data[sensor.key]
                if not action.id:
                    ctx.db.add(action)
                log.info('SensorAction@node%s -> %s:%s -> %s %s'
                        % (node_id, sensor.name, sensor.key,
                            "{:}".format(action.value), sensor.unit))

