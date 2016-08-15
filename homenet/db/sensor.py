from .storable import Storable
from score.db import IdType
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship, Session
from .action import SensorAction
from datetime import date, timedelta


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
        data['last_action'] = self.last_action.as_dict(
                only_members=['id', 'value', 'time']
                ) if self.last_action else None
        return data

    @property
    def last_action(self):
        session = Session.object_session(self)
        return session.query(SensorAction).\
                filter(SensorAction.sensor == self).\
                order_by(SensorAction.time.desc()).\
                first()

    @property
    def daily_actions(self):
        session = Session.object_session(self)
        print(date.today() - timedelta(days=1))
        return session.query(SensorAction).\
                filter(SensorAction.sensor == self).\
                filter(SensorAction.time > date.today() - timedelta(days=1)).\
                order_by(SensorAction.time.asc())

