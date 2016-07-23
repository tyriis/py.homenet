from .storable import Storable
from score.db import IdType
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship, Session
from .action import SensorAction


class Sensor(Storable):
    name = Column(String, nullable=False)
    node_id = Column(IdType, ForeignKey('_node.id'), nullable=False)
    node = relationship('Node', backref='sensors')
    key = Column(String, nullable=False)
    unit = Column(String, nullable=False)

    def as_dict(self, only_members=None):
        data = super(Sensor, self).as_dict(only_members=only_members)
        if only_members:
            return data
        data['last_action'] = self.last_action.as_dict(only_members=['id', 'value', 'time']) if self.last_action else None
        return data

    @property
    def last_action(self):
        session = Session.object_session(self)
        return session.query(SensorAction).\
                filter(SensorAction.sensor == self).\
                order_by(SensorAction.time.desc()).\
                first()

