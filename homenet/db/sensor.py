from .storable import Storable
from score.db import IdType
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship


class Sensor(Storable):
    name = Column(String, nullable=False)
    node_id = Column(IdType, ForeignKey('_node.id'), nullable=False)
    node = relationship('Node')
    key = Column(String, nullable=False)
    unit = Column(String, nullable=False)

