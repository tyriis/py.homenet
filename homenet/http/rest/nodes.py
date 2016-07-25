from ..router import router
import homenet.db as db
import json

@router.route('rest/nodes', '/rest/nodes')
def locations(ctx):
    ctx.http.response.content_type = 'application/json'
    if ctx.http.request.method == 'POST':
        node = db.Node.from_dict(ctx, ctx.http.request.POST)
        return node.as_JSON()
    return db.Node.get_full_json(ctx)

@router.route('rest/node', '/rest/nodes/{node.id}')
def location(ctx, node: db.Node):
    ctx.http.response.content_type = 'application/json'
    return node.as_JSON()
