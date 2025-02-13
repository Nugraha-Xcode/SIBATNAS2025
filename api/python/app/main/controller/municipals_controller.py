from flask import request
from flask_restplus import Resource

from ..util.dto import MunicipalsDto
from ..service.municipals_service import get_a_municipal, get_all, get_municipals_by_province_id, get_municipals_by_query

api = MunicipalsDto.api
_schema =  MunicipalsDto.schema

@api.route('/')
class MunicipalsList(Resource):
    @api.doc('list of municipals')
    @api.marshal_list_with(_schema, envelope='data')
    #@admin_token_required
    def get(self):
        """List all types"""
        return get_all()


@api.route('/search/<query>')
@api.param('query', 'The query')
@api.response(404, 'Municipals not found.')
class RegionsQueryList(Resource):
    @api.doc('list of municipals by query')
    @api.marshal_list_with(_schema, envelope='data')
    #@admin_token_required
    def get(self, query):
        """List all municipals"""
        return get_municipals_by_query(query)

@api.route('/province/<int:id>')
@api.param('id', 'The province id')
@api.response(404, 'Municipal not found.')
class MunicipalProvinceList(Resource):
    @api.doc('list of municipals by province id')
    @api.marshal_list_with(_schema, envelope='data')
    #@admin_token_required
    def get(self, id):
        """List all municipals by province id"""
        return get_municipals_by_province_id(id)

@api.route('/id/<int:id>')
@api.param('id', 'The Municipal id')
@api.response(404, 'Municipal not found.')
class Municipal(Resource):
    @api.doc('get a municipal')
    #@api.marshal_with(_schema)
    #@admin_token_required
    def get(self, id):
        """get a Municipal given its id"""
        row = get_a_municipal(id)
        if not row:
        	response_object = {
        		'status': 'fail',
        		'message': 'Municipal ID is not found.',
        	}
        	return response_object, 404
        else:
            return row