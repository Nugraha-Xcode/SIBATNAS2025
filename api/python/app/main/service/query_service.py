import uuid
import datetime

from app.main import db
from app.main.model.harvestings import Harvestings
from sqlalchemy import func, extract, desc
from flask.json import jsonify
import json

def list_year():
    result = db.session.query(extract('year',Harvestings.publication_date).label('year')).order_by(desc('year')).distinct().all()
    my_list = []   
    for row in result:
        print(row.year)
        print(type(row.year))
        my_list.append({"year": int(row.year)})
    print(my_list)
    results = [dict(row) for row in my_list]
    #results = [list(row) for row in result]
    result_dict = {'data': results}
    #response_object = {
    #        'status': 'oke',
    #        'data': jsonify([dict(row) for row in result])
    #}
    return result_dict, 200