from .. import db
from geoalchemy2 import Geometry

class Records(db.Model):
    """ Records Model for storing records related details """
    __tablename__ = 'records'

    identifier = db.Column(db.String, primary_key=True)
