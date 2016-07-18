from .storable import Storable
from sqlalchemy import Column, String
from sqlalchemy_utils.types.password import PasswordType

class User(Storable):
    username = Column(String(100), nullable=False)
    password = Column(PasswordType(schemes=['pbkdf2_sha512']))

class Blogger(User):
    pass
