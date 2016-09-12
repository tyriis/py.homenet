from .storable import Storable
from sqlalchemy import Column, String
from sqlalchemy_utils.types.password import PasswordType
from os import urandom
import binascii

class User(Storable):
    username = Column(String(100), nullable=False)
    password = Column(PasswordType(schemes=['pbkdf2_sha512']))
    persist_hash = Column(String, unique=True)

    def verify_password(self, password):
        if self.password:
            return self.password == password
        return False

    def get_persist_hash(self, ctx, create_new=False):
        if not create_new and self.persist_hash:
            return self.persist_hash
        persist_hash = binascii.hexlify(urandom(24)).decode('utf8')
        not_unique = ctx.db.query(User.id). \
            filter(User.persist_hash == persist_hash).first()
        if not_unique:
            persist_hash = self.get_persist_hash(ctx)
        self.persist_hash = persist_hash
        return persist_hash

