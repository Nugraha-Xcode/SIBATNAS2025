from flask import request, jsonify, json
from flask_restplus import Resource

from ..util.dto import ActivitiesDto
from ..service.activities_service import get_all_activities
from ..util.decorator import admin_token_required
from ..util.pagination import get_paginated_list

#from flask_restplus import cors

api = ActivitiesDto.api
_schema = ActivitiesDto.schema

@api.route('/')
#@api.header('Authorization: Bearer', 'JWT TOKEN', required=True)
class UserList(Resource):
    @api.response(401, 'Unauthorized.')
    @api.doc('list_of_registered_users')
    @api.marshal_list_with(_schema, envelope='data')
    @admin_token_required
    #@cors.crossdomain(origin='*')
    
    def get(self):
        """List all registered users"""
        return get_all_activities()
        #try pagination
        #print(get_paginated_list())
        #data = [{'employee_id': i+1} for i in range(1000)]
        #print(type(data))
        #print(type(get_all_users()))
        #for i in get_all_users(): 
        #    print(i.as_dict()) 
        #print(json.dumps([ row.as_dict() for row in get_all_users ]))
        #print( row.items for row in get_all_users )
        #return jsonify(get_paginated_list(
        #get_all_users(), 
        #'/', 
        #start=request.args.get('start', 1), 
        #limit=request.args.get('limit', 20)
    #))
