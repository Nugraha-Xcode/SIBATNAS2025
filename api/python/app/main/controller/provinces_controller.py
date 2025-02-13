from flask import request
from flask_restplus import Resource

from ..util.dto import ProvincesDto
from ..service.provinces_service import get_a_province, get_all, get_provinces_by_country_id

api = ProvincesDto.api
_schema =  ProvincesDto.schema

@api.route('/')
class ProvinceList(Resource):
    @api.doc('list of provinces')
    @api.marshal_list_with(_schema, envelope='data')
    #@admin_token_required
    def get(self):
        """List all provinces"""
        return get_all()

@api.route('/country/<int:id>')
@api.param('id', 'The country id')
@api.response(404, 'Country not found.')
class ProvincesCountryList(Resource):
    @api.doc('list of provinces by country id')
    @api.marshal_list_with(_schema, envelope='data')
    #@admin_token_required
    def get(self, id):
        """List all provinces by country id"""
        return get_provinces_by_country_id(id)

@api.route('/id/<int:id>')
@api.param('id', 'The Province id')
@api.response(404, 'Province not found.')
class Province(Resource):
    @api.doc('get a province')
    #@api.marshal_with(_schema)
    #@admin_token_required
    def get(self, id):
        """get a Province given its id"""
        row = get_a_province(id)
        if not row:
        	response_object = {
        		'status': 'fail',
        		'message': 'Province ID is not found.',
        	}
        	return response_object, 404
        else:
            return row