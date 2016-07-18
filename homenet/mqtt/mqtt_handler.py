import homenet.db as db
import json

def msg_handler(ctx, msg):
    topic_parts = msg.topic.split('/')
    if topic_parts[0] != 'node':
        return
    node_id = topic_parts[1]
    node = ctx.db.query(db.Node).get(node_id)
    data = json.loads(msg.payload.decode('utf-8'))
    if 'sensor' in data.keys():
        sensors = ctx.db.query(db.Sensor).\
            filter(db.Sensor.node == node).\
            filter(db.Sensor.name == data['sensor'])
        for sensor in sensors:
            if sensor.key in data.keys():
                action = db.SensorAction(
                        sensor=sensor,
                        value=data[sensor.key])
                ctx.db.add(action)
                print('added new SensorAction for %s' % sensor.key)

