from ..router import router
import homenet.db as db
from docutils.core import publish_parts
import json

@router.route('rest/locations', '/rest/locations')
def locations(ctx):
    ctx.http.response.content_type = 'application/json'
    locations = ctx.db.query(db.Location).all()
    data = list()
    for location in locations:
        data.append(get_object(location))
    return json.dumps(data, sort_keys=True, indent=4, separators=(',', ': '))

@router.route('rest/location', '/rest/locations/{location.id}')
def location(ctx, location: db.Location):
    ctx.http.response.content_type = 'application/json'
    return json.dumps(get_object(location), sort_keys=True, indent=4, separators=(',', ': '))

def get_object(location):
    nodes_data = list()
    for node in location.nodes:
        nodes_data.append({
            'id': node.id,
            'name': node.name
        })
    data = {
        'id': location.id,
        'name': location.name,
        'description': location.description,
        'nodes': nodes_data
    }
    return data

