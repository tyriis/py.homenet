from .storable import Storable
from score.db import IdType
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship


class Article(Storable):
    author_id = Column(IdType, ForeignKey('_blogger.id'), nullable=False)
    author = relationship('Blogger')
    title = Column(String(200), nullable=False)
    teaser = Column(String, nullable=False)
    body = Column(String, nullable=False)
