from score.db import create_base
from sqlalchemy.orm import RelationshipProperty, ColumnProperty,  collections
from datetime import datetime
import json

Storable = create_base()

def as_dict(self, only_members=None):
    _dict = {}
    for member in self.__mapper__.attrs.items():
        if type(member[1]) != ColumnProperty and type(member[1]) != RelationshipProperty:
            continue
        if only_members and member[0] not in only_members:
            continue
        if member[0].endswith('_id') and member[0].replace('_id', '') in _dict:
            continue
        if member[0] == 'password':
            continue
        if member[0].endswith('_hash'):
            continue
        _value = getattr(self, member[0])
        if type(member[1]) != RelationshipProperty:
            if type(_value)  == datetime:
                _value = _value.timestamp() * 1000
            _dict[member[0]] = _value
            continue
        if type(_value) == collections.InstrumentedList:
            _dict[member[0]] = [item.as_dict(only_members=['id', 'name']) for item in _value]
        else:
            _dict.pop(member[0] + '_id', None)
            _dict[member[0]] = _value.as_dict(only_members=['id', 'name'])
    return _dict

Storable.as_dict = as_dict

def as_JSON(self):
    return json.dumps(self.as_dict(), sort_keys=True, indent=4, separators=(',', ': '))

Storable.as_JSON = as_JSON

@classmethod
def from_dict(cls, ctx, dict):
    location = cls()
    for col in cls.__table__.columns:
        if col.name in ['id', '_type']:
            continue
        if not col.nullable and col.name not in dict:
            raise ValueError('%s is not nullable' % col.name)
        print({'col.name': col.name, 'col.name in dict': col.name in dict})
        if col.name in dict:
            setattr(location, col.name, dict[col.name])
    ctx.db.add(location)
    ctx.db.flush()
    return location

Storable.from_dict = from_dict

@classmethod
def get_full_json(cls, ctx, limit=25):
    data = [o.as_dict() for o in ctx.db.query(cls).limit(limit)]
    return json.dumps(data, sort_keys=True, indent=4, separators=(',', ': '))

Storable.get_full_json = get_full_json

