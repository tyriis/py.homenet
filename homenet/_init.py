from score.init import ConfiguredModule
from homenet.mqtt import msg_handler

defaults = {
}


def init(confdict, db, ctx, mqtt):
    """
    Initializes this module acoording to the :ref:`SCORE module initialization
    guidelines <module_initialization>` with the following configuration keys:
    """
    conf = defaults.copy()
    conf.update(confdict)
    #print(ctx.db.query(db.Node).first())
    #mqtt.subscribe('$SYS/broker/uptime', test)
    mqtt.subscribe('node/01', msg_handler)
    return ConfiguredHomenetModule()

#def test(ctx, msg):
#    print(msg.payload)

class ConfiguredHomenetModule(ConfiguredModule):

    def __init__(self):
        import homenet
        super().__init__(homenet)
