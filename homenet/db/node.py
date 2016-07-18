from .storable import Storable
from score.db import IdType
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship


class Node(Storable):
    name = Column(String, nullable=False)
    location_id = Column(IdType, ForeignKey('_location.id'), nullable=False)
    location = relationship('Location')
    identifier = Column(String, unique=True)

