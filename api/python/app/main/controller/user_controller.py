from flask import request, jsonify, json
from flask_restplus import Resource

from ..util.dto import UserDto
from ..service.user_service import save_new_user, password_user, update_user, update_user_admin, get_all_users, get_a_user, get_a_user_email, get_a_user_username, delete_user
from ..util.decorator import admin_token_required, token_required
from ..util.pagination import get_paginated_list

#from flask_restplus import cors

api = UserDto.api
_user = UserDto.user
_schema = UserDto.schema
_update = UserDto.update
_password = UserDto.password
_delete = UserDto.delete

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
        return get_all_users()
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

    @api.response(201, 'User successfully created.')
    @api.response(409, 'Username or Email already Exists')
    @api.doc('create a new user')
    @api.expect(_user, validate=True)
    @admin_token_required
    def post(self):
        """Creates a new User """
        data = request.json
        return save_new_user(data=data)


@api.route('/id/<public_id>')
@api.param('public_id', 'The User identifier')
@api.response(404, 'User not found.')
@api.response(401, 'Unauthorized.')
class User(Resource):
    @api.doc('get a user')
    @api.marshal_with(_schema)
    @token_required
    def get(self, public_id):
        """get a user given its identifier"""
        user = get_a_user(public_id)
        if not user:
            api.abort(404)
        else:
            return user

@api.route('/email/<email>')
@api.param('email', 'The User email')
@api.response(404, 'User not found.')
@api.response(401, 'Unauthorized.')
class UserEmail(Resource):
    @api.doc('get a user')
    @api.marshal_with(_schema)
    @token_required
    def get(self, email):
        """get a user given its email"""
        user = get_a_user_email(email)
        if not user:
            api.abort(404)
        else:
            return user
			
@api.route('/username/<username>')
@api.param('username', 'The Username')
@api.response(404, 'User not found.')
@api.response(401, 'Unauthorized.')
class UserUsername(Resource):
    @api.doc('get a user')
    @api.marshal_with(_schema)
    @token_required
    def get(self, username):
        """get a user given its username"""
        user = get_a_user_username(username)
        if not user:
            api.abort(404)
        else:
            return user


@api.route('/delete/')
class UserDelete(Resource):
    @api.response(201, 'User successfully deleted.')
    @api.doc('delete an user')
    @api.expect(_delete, validate=True)
    @token_required
    def post(self):
        """Delete an User """
        data = request.json
        return delete_user(data=data)


@api.route('/update/')
class UserUpdate(Resource):
    @api.response(200, 'User information successfully updated.')
    @api.doc('update a user')
    @api.expect(_update, validate=True)
    @token_required
    def post(self):
        """Update a User"""
        data = request.json
        return update_user(data=data)
    
@api.route('/updateAdmin/')
class UserUpdate(Resource):
    @api.response(200, 'User information successfully updated.')
    @api.doc('update a user')
    @api.expect(_update, validate=True)
    @admin_token_required
    def post(self):
        """Update a User"""
        data = request.json
        return update_user_admin(data=data)

@api.route('/password/')
class UserPasssword(Resource):
    @api.response(200, 'User password successfully update.')
    @api.doc('update an user password')
    @api.expect(_password, validate=True)
    @token_required
    def post(self):
        """Update a user password"""
        data = request.json
        return password_user(data=data)