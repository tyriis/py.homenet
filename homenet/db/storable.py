from score.db import create_base
from sqlalchemy.orm import relationships, collections
from datetime import datetime

Storable = create_base()

def as_dict(self, only_members=None):
    if only_members:
        try:
            _dict = {}
            for member in only_members:
                _value = getattr(self, member)
                if type(_value) == datetime:
                    _dict[member] = _value.timestamp() * 1000
                else:
                    _dict[member] = _value
            return _dict
        except AttributeError:
            return {'id': self.id}
    _dict = {c.name: getattr(self, c.name) for c in self.__table__.columns}
    print(_dict)
    for member in self.__mapper__.attrs.items():
        print(member)
        if type(member[1]) != relationships.RelationshipProperty:
            continue
        _value = getattr(self, member[0])
        if type(_value) == collections.InstrumentedList:
            _dict[member[0]] = [item.as_dict(only_members=['id', 'name']) for item in _value]
        else:
            _dict.pop(member[0] + '_id', None)
            _dict[member[0]] = _value.as_dict(only_members=['id', 'name'])
    #print(_dict)
    return _dict

Storable.as_dict = as_dict

