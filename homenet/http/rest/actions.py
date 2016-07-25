from ..router import router
import homenet.db as db
import json

@router.route('rest/actions', '/rest/actions')
def actions(ctx):
    return db.Action.get_full_json(ctx, limit=100)

@router.route('rest/action', '/rest/actions/{action.id}')
def action(ctx, action: db.Action):
    ctx.http.response.content_type = 'application/json'
    return action.as_JSON()
