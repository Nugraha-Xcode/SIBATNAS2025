import uuid
import datetime

from app.main import db
from app.main.model.provinces import Provinces
from sqlalchemy import func
from flask.json import jsonify
from owslib.csw import CatalogueServiceWeb

def get_a_province(id):
    #query =  db.session.query(Countries.name, Countries.geom.ST_Envelope().ST_AsTEXT(), Countries.geom.ST_AsGeoJSON()).filter(Countries.id == id).first()
    query =  db.session.query(Provinces.name, Provinces.geom.ST_Transform(3857).ST_Envelope().ST_AsGeoJSON(), Provinces.geom.ST_Envelope().ST_AsGeoJSON(), Provinces.geom.ST_Transform(3857).ST_AsGeoJSON()).filter(Provinces.id == id).first()
    #print(query)
    if (query):
        #print(query[1])
        response_object = {
                'status': 'ok',
                'message': {
                    'name' : query[0],
                    'bbox' : query[1],
                    'center' : query[2],
                    'geom' : query[3]
                }
        }
        return response_object, 200
    else:
        response_object = {
                'status': 'failed',
                'message': 'id not found',
            }

    return response_object, 200
    #Countries.query.filter_by(id=id).first()
    # 
def get_all():
    return Provinces.query.order_by('name').all()

def get_provinces_by_country_id(id):
    return Provinces.query.filter_by(country_id=id).order_by('name').all()