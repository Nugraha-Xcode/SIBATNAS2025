from flask import request, send_file, Response
from flask_restplus import Resource
import os
from ..util.dto import MetadataDto
from ..service.metadata_service import get_a_metadata, get_all, get_all_public_id, save_new_metadata, update_metadata, delete_metadata, get_info, update_metadata_admin, download_metadata
from ..util.decorator import admin_token_required, token_required

api = MetadataDto.api
_schema =  MetadataDto.schema
_entry =  MetadataDto.entry
_update =  MetadataDto.update
_updateAdmin =  MetadataDto.updateAdmin
_delete =  MetadataDto.delete

#APP_ROOT = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'metadata','uploads')


@api.route('/')
class MetadataDtoList(Resource):
    @api.doc('list of metadata')
    @api.marshal_list_with(_schema, envelope='data')
    @admin_token_required
    def get(self):
        """List all metadata"""
        return get_all()

    @api.response(201, 'Metadata successfully created.')
    @api.doc('create a new metadata')
    #@api.expect(_entry, validate=True)
    #@admin_token_required
    @token_required
    def post(self):
        """Creates a new Metadata """
        #data = request.json

        file = request.files['file']
        #username= request['username']
        print(file)
        #print(request.__dict__)
        #print(request.form['username'])
        public_id = request.form['public_id']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            response_object = {
            'status': 'error',
            'message': 'Select file first'
            }
            return response_object, 200
        else:
            if file.filename[-4:] == '.xml':
                file.save(os.path.join(UPLOAD_FOLDER, file.filename))
                size = os.path.getsize(os.path.join(UPLOAD_FOLDER, file.filename))
                print(size)
                if size/(1024*1024) > 2:
                    os.remove(os.path.join(UPLOAD_FOLDER, file.filename))
                    response_object = {
                    'status': 'error',
                    'message': 'file size >  2 Mb'
                    }
                    return response_object, 200
                else:
                    return save_new_metadata(file.filename, public_id)
            else:
                response_object = {
                    'status': 'error',
                    'message': 'file should be .xml'
                    }
                return response_object, 200

@api.route('/id/<int:id>')
@api.param('id', 'The Metadata id')
@api.response(404, 'Metadata not found.')
class Metadata(Resource):
    @api.doc('get a metadata')
    @api.marshal_with(_schema)
    #@admin_token_required
    def get(self, id):
        """get an metadata given its id"""
        row = get_a_metadata(id)
        if not row:
            response_object = {
        		'status': 'fail',
        		'message': 'Metadata ID is not found.',
            }
            return response_object, 404
        else:
            return row

@api.route('/update/')
class MetadataUpdate(Resource):
    @api.response(200, 'Metadata successfully updated.')
    @api.doc('update a metadata')
    @api.expect(_update, validate=True)
    @token_required
    def post(self):
        """Update a Metadata"""
        data = request.json
        return update_metadata(data=data)


@api.route('/updateAdmin/')
class MetadataUpdateAdmin(Resource):
    @api.response(201, 'Metadata successfully updated.')
    @api.doc('update a metadata')
    @api.expect(_updateAdmin, validate=True)
    @token_required
    def post(self):
        """Update a Metadata"""
        data = request.json
        return update_metadata_admin(data=data)


@api.route('/delete/')
class MetadataDelete(Resource):
    @api.response(200, 'Metadata successfully deleted.')
    @api.doc('delete an metadata')
    @api.expect(_delete, validate=True)
    @token_required
    def post(self):
        """Delete an Metadata """
        data = request.json
        auth_header = request.headers.get('Authorization')
        return delete_metadata(data=data, auth_header=auth_header)

@api.route('/download/<int:id>')
@api.param('id', 'The message identifier')
@api.response(404, 'The Message not found.')
@api.response(401, 'Unauthorized.')
class Data(Resource):
    @api.doc('get a message')
    #@api.marshal_with(_schema)
    #@token_required
    def get(self, id):
        """get a message given its identifier"""
        username, filename = get_info(id)
        path = os.path.join(UPLOAD_FOLDER,filename)
        print(path)

        if not filename:
            api.abort(404)
        else:
            #auth_header = request.headers.get('Authorization')
            #download_metadata(path=path,auth_header=auth_header)
            return send_file(path, as_attachment="true")

@api.route('/view/<int:id>')
@api.param('id', 'The message identifier')
@api.response(404, 'The Message not found.')
@api.response(401, 'Unauthorized.')
class Data(Resource):
    @api.doc('get a message')
    #@api.marshal_with(_schema)
    @token_required
    def get(self, id):
        """get a message given its identifier"""
        username, filename = get_info(id)
        path = os.path.join(UPLOAD_FOLDER,filename)

        if not filename:
            api.abort(404)
        else:
            with open(path, "r") as f: 
                content = f.read() 
                return  Response(content, mimetype='text/xml')

@api.route('/produsen/<public_id>')
@api.param('public_id', 'The Produsen public_id')
@api.response(404, 'Contribution not found.')
class Contribution(Resource):
    @api.doc('get a contribution')
    @api.marshal_list_with(_schema, envelope='data')
    @token_required
    def get(self, public_id):
        """get a contribution given its username"""
        return get_all_public_id(public_id)
