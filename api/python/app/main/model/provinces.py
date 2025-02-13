from .. import db
from geoalchemy2 import Geometry

class Provinces(db.Model):
    """ Countries Model for storing countries related details """
    __tablename__ = 'provinces'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    country_id = db.Column(db.Integer, db.ForeignKey('countries.id', ondelete='CASCADE'), nullable=False)
    countries = db.relationship('Countries', backref=db.backref('parent', lazy='dynamic'))
    geom = db.Column(Geometry('MULTIPOLYGON', srid='4326'))

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns if c.name != 'province_id'}