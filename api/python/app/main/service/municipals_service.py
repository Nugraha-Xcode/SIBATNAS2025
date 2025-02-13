import uuid
import datetime

from app.main import db
from app.main.model.municipals import Municipals
from sqlalchemy import func
from flask.json import jsonify
from owslib.csw import CatalogueServiceWeb

def get_a_municipal(id):
    #query =  db.session.query(Countries.name, Countries.geom.ST_Envelope().ST_AsTEXT(), Countries.geom.ST_AsGeoJSON()).filter(Countries.id == id).first()
    query =  db.session.query(Municipals.name, Municipals.geom.ST_Envelope().ST_AsGeoJSON(), Municipals.geom.ST_Envelope().ST_Centroid().ST_AsGeoJSON(), Municipals.geom.ST_AsGeoJSON()).filter(Municipals.id == id).first()
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
    return Municipals.query.order_by('name').all()

def get_municipals_by_province_id(id):
    return Municipals.query.filter_by(provinces_id=id).order_by('name').all()

def get_municipals_by_query(q):
    search = "%{}%".format(q)
    #print(search)
    return Municipals.query.filter(Municipals.name.ilike(search)).all()