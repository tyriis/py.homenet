from datetime import datetime

from score.db import IdType
from sqlalchemy import Column, ForeignKey, DateTime, Integer, String
from sqlalchemy.orm import relationship

from .storable import Storable


class Action(Storable):
    time = Column(DateTime, nullable=False, default=lambda: datetime.now())


class SensorAction(Action):
    sensor_id = Column(IdType, ForeignKey('_sensor.id'), nullable=False)
    sensor = relationship('Sensor')
    value = Column(Integer, nullable=False)


class NodeAction(Action):
    node_id = Column(IdType, ForeignKey('_node.id'), nullable=False)
    node = relationship('Node')
    value = Column(Integer, nullable=False)
    type = Column(String, nullable=False)
