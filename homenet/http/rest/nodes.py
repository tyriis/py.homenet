from ..router import router
import homenet.db as db
import json

@router.route('rest/nodes', '/rest/nodes')
def locations(ctx):
    ctx.http.response.content_type = 'application/json'
    nodes = ctx.db.query(db.Node).all()
    data = list()
    for node in nodes:
        data.append(get_object(node))
    return json.dumps(data, sort_keys=True, indent=4, separators=(',', ': '))

@router.route('rest/node', '/rest/nodes/{node.id}')
def location(ctx, node: db.Node):
    ctx.http.response.content_type = 'application/json'
    return json.dumps(get_object(node), sort_keys=True, indent=4, separators=(',', ': '))

def get_object(node):
    sensors_data = list()
    for sensor in node.sensors:
        sensors_data.append({
            'id': sensor.id,
            'name': sensor.name
        })
    data = {
        'id': node.id,
        'name': node.name,
        'location': {
            'id': node.location.id,
            'name': node.location.name
        },
        'identifier': node.identifier,
        'sensors': sensors_data
    }
    return data

