from .storable import Storable
from score.db import IdType
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship, relationships, collections


class Location(Storable):
    name = Column(String, nullable=False)
    description = Column(String)

