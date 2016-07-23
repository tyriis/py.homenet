from ..router import router
import homenet.db as db
import json

@router.route('rest/nodes', '/rest/nodes')
def locations(ctx):
    ctx.http.response.content_type = 'application/json'
    nodes = ctx.db.query(db.Node).all()
    data = list()
    for node in nodes:
        data.append(node.as_dict())
    return json.dumps(data, sort_keys=True, indent=4, separators=(',', ': '))

@router.route('rest/node', '/rest/nodes/{node.id}')
def location(ctx, node: db.Node):
    ctx.http.response.content_type = 'application/json'
    return json.dumps(node.as_dict(), sort_keys=True, indent=4, separators=(',', ': '))

