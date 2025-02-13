from .. import db
from geoalchemy2 import Geometry

class Regions(db.Model):
    """ Regions Model for storing regions related details """
    __tablename__ = 'regions'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    geom = db.Column(Geometry('MULTIPOLYGON', srid='4326'))
    province_id = db.Column(db.Integer, db.ForeignKey('provinces.id', ondelete='CASCADE'), nullable=False)
    provinces = db.relationship('Provinces', backref=db.backref('parent', lazy='dynamic'))

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns if c.name != 'region_id'}