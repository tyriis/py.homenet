from .mqtt_handler import msg_handler

def subscribe(ctx, mqtt):
    with ctx.Context() as ctx:
        from homenet import db
        nodes = ctx.db.query(db.Node).all()
        for node in nodes:
            mqtt.subscribe(node.identifier, msg_handler)


