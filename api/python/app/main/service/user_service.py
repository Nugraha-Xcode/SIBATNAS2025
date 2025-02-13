import uuid
import datetime
import re
import random
import string
import json
from app.main import db#, mail
from app.main.model.user import User
from app.main.model.activities import Activities
from ..service.network_helper import get_ip_client

#from flask_mail import Message
from smtplib import SMTPAuthenticationError, SMTPConnectError, SMTPServerDisconnected, SMTPException
import requests
from requests.exceptions import HTTPError

def save_new_user(data):
    user = User.query.filter_by(email=data['email']).first()
    if not user:
        password = user_random_generator()
        new_user = User(
            public_id=str(uuid.uuid4()),
            email=data['email'],
            fullname=data['fullname'],
            password=password,
            is_activated = True,
            registered_on=datetime.datetime.utcnow()
        )
        save_changes(new_user)
        #response_object = {
        #    'status': 'success',
        #    'message': 'Successfully registered.'
        #}
        #return response_object, 201
        return send_email(data['email'], password, 'Produsen')
    else:
        response_object = {
            'status': 'fail',
            'message': 'Email already exists',
        }
        return response_object, 409

def get_all_users():
    return User.query.filter_by(admin=False).all()

def get_a_user(public_id):
    return User.query.filter_by(public_id=public_id).first()
	
def get_a_user_email(email):
    return User.query.filter_by(email=email).first()

def get_a_user_username(username):
    return User.query.filter_by(username=username).first()

def save_changes(data):
    db.session.add(data)
    db.session.commit()

def generate_token(user):
    try:
        # generate the auth token
        auth_token = user.encode_auth_token(user.id)
        response_object = {
            'status': 'success',
            'message': 'Successfully registered.',
            'Authorization': auth_token.decode()
        }
        return response_object, 201
    except Exception as e:
        response_object = {
            'status': 'fail',
            'message': 'Some error occurred. Please try again.'
        }
        return response_object, 401


def delete_user(data):
    user = User.query.filter_by(public_id=data['public_id']).first()
    if user:
        User.query.filter_by(public_id=data['public_id']).delete()
        db.session.commit()
        response_object = {
            'status': 'success',
            'message': 'Successfully deleted.'
        }
        return response_object, 200
    else:
        response_object = {
            'status': 'fail',
            'message': 'User not found',
        }
        return response_object, 200


def update_user(data):
    user = User.query.filter_by(public_id=data['public_id']).first()
    if user:
        setattr(user, 'fullname', data['fullname'])
        new_activity = Activities(
            ip_address = get_ip_client(),
            modul = "User",
            task = "Update Profile",
            data = "fullname=" + data.get('fullname'),
            activity_time = datetime.datetime.utcnow()+ datetime.timedelta(hours=7),
            status = "success",
            user_id = user.id
        )
        db.session.add(new_activity)
        db.session.commit()
        response_object = {
            'status': 'success',
            'message': 'Successfully updated.'
        }
        return response_object, 200
    else:
        response_object = {
            'status': 'fail',
            'message': 'User not found',
        }
        return response_object, 200


def update_user_admin(data):
    user = User.query.filter_by(public_id=data['public_id']).first()
    if user:
        setattr(user, 'fullname', data['fullname'])
        if (data['email'] != user.email):
            setattr(user, 'email', data['email'])
            password = user_random_generator()
            setattr(user, 'password', password)
            db.session.commit()
            return send_email(data['email'], password, 'Produsen')
        else:
            db.session.commit()
            response_object = {
                'status': 'success',
                'message': 'Successfully updated.'
            }
            return response_object, 200
    else:
        response_object = {
            'status': 'fail',
            'message': 'User not found',
        }
        return response_object, 200

def password_user(data):
    user = User.query.filter_by(public_id=data['public_id']).first()

    if user:
        if user.check_password(data['current_password']):
            if (data['new_password'] == data['repeat_password']):
                if user_input_password_check(data['new_password']):
                    setattr(user, 'password', data['new_password'])
                    new_activity = Activities(
                        ip_address = get_ip_client(),
                        modul = "User",
                        task = "Update Password",
                        data = "password matched and strong",
                        activity_time = datetime.datetime.utcnow()+ datetime.timedelta(hours=7),
                        status = "success",
                        user_id = user.id
                    )
                    db.session.add(new_activity)
                    db.session.commit()
                    
                    response_object = {
                        'status': 'success',
                        'message': 'Successfully updated.'
                    }
                    return response_object, 200
                else:
                    new_activity = Activities(
                        ip_address = get_ip_client(),
                        modul = "User",
                        task = "Update Password",
                        data = "password not strong",
                        activity_time = datetime.datetime.utcnow()+ datetime.timedelta(hours=7),
                        status = "failed",
                        user_id = user.id
                    )
                    db.session.add(new_activity)
                    db.session.commit()
                    
                    response_object = {
                        'status': 'fail',
                        'message': 'Please use strong password (min 8 characters, use at least one uppercase, one lowercase, one digit)',
                    }
                    return response_object, 200
            else:
                new_activity = Activities(
                        ip_address = get_ip_client(),
                        modul = "User",
                        task = "Update Password",
                        data = "password and repeat not matched",
                        activity_time = datetime.datetime.utcnow()+ datetime.timedelta(hours=7),
                        status = "failed",
                        user_id = user.id
                )
                db.session.add(new_activity)
                db.session.commit()
                response_object = {
                    'status': 'fail',
                    'message': 'New password and repeat password do not match',
                }
                return response_object, 200
        else:
            new_activity = Activities(
                        ip_address = get_ip_client(),
                        modul = "User",
                        task = "Update Password",
                        data = "current password is incorrect",
                        activity_time = datetime.datetime.utcnow()+ datetime.timedelta(hours=7),
                        status = "failed",
                        user_id = user.id
                )
            db.session.add(new_activity)
            db.session.commit()
            
            response_object = {
                'status': 'fail',
                'message': 'Current password is incorrect',
            }
            return response_object, 200
    else:
        response_object = {
            'status': 'fail',
            'message': 'User not found',
        }
        return response_object, 200

def uppercase_check(password):
    if re.search('[A-Z]', password): #atleast one uppercase character
        return True
    return False

def lowercase_check(password):
    if re.search('[a-z]', password): #atleast one lowercase character
        return True
    return False

def digit_check(password):
    if re.search('[0-9]', password): #atleast one digit
        return True
    return False

def symbol_check(password):
    if re.search('^[a-zA-Z0-9]', password):
            return True
    return False

def user_input_password_check(password):
    #atleast 8 character long
    if len(password) >= 8 and uppercase_check(password) and lowercase_check(password) and digit_check(password) and symbol_check(password):
        return True
        #print("Strong Password")
    else:
        return False
        #print("Weak Password")

def user_random_generator():  
    #define data
    lower = string.ascii_lowercase
    upper = string.ascii_uppercase
    num = string.digits
    symbols = string.punctuation
    #string.ascii_letters

    #combine the data
    all = lower + upper + num + symbols

    #use random 
    temp = random.sample(all,8)

    #create the password 
    password = "".join(temp)
    return password


def send_email(email, password, role):
    url = "https://tanahair.indonesia.go.id/api/v1/mail/send"
    pesan = "Please login to SIKAMBING as "+ role + "<br /><br />" 
    pesan = pesan + "password : " + password + " <br />"
    payload = json.dumps({
    "receiver": email,
    "subject": "[SIKAMBING] User Registration",
    "content": pesan
    })
    headers = {
    'Authorization': 'Basic MmZkYjA5ODY1ZTg1ZmY6NjI5NDU0NzU2NjM0MTk=',
    'Content-Type': 'application/json'
    }

    
    try:
        response = requests.request("POST", url, headers=headers, data=payload)
        response.raise_for_status()
        # access JSOn content
        jsonResponse = response.json()
        #print("Entire JSON response")
        print(jsonResponse)
        if jsonResponse['success'] == True:
            response_object = {
                    'status': 'success',
                    'message': jsonResponse['message']
                }
            return response_object, 201
        else:
            response_object = {
                'status': 'fail',
                'message': 'Email cannot be sent.',
            }
            return response_object, 200
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
        response_object = {
                    'status': 'fail',
                    'message': 'Problem HTTP Error.'
        }
        return response_object, 200
    except Exception as err:
        print(f'Other error occurred: {err}')
        print(f'HTTP error occurred: {http_err}')
        response_object = {
                    'status': 'fail',
                    'message': 'Problem Error: Exception arised.'
        }
        return response_object, 200

def send_email_esdm(email, password, role):
    url = "https://eai.esdm.go.id/api/v1/mail/send"
    pesan = "Please login to SIKAMBING as "+ role + "<br /><br />" 
    pesan = pesan + "password : " + password + " <br />"
    payload = json.dumps({
    "receiver": email,
    "subject": "[SIKAMBING] User Registration",
    "content": pesan
    })
    headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Basic c2lrYW1iaW5nOnNpa2FtYmluZ0AhI2VzZG0='
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    resp = response.json()
    print(resp)
    if resp['success'] == True:
        response_object = {
                'status': 'success',
                'message': resp['message']
            }
        return response_object, 201
    else:
        response_object = {
            'status': 'fail',
            'message': 'Email cannot be sent.',
        }
        return response_object, 200
    '''
    print(mail.connect())
    subject = "[SIKAMBING] User Forgot Password"
    msg = Message(subject, recipients=[email])
    #msg.body = "testing"
    pesan = "Please login to SIKAMBING as "+ role + "<br /><br />" 
    pesan = pesan + "password : " + password + "<br />"
    
    msg.html = pesan 
    #with app.app_context():
    try:
        mail.send(msg)
        response_object = {
                'status': 'success',
                'message': 'Successfully sent.'
            }
        return response_object, 201
    except SMTPAuthenticationError:
        response_object = {
            'status': 'fail',
            'message': ' SMTPAuthentication Error.',
        }
        return response_object, 200
        #retcode = 2
    except SMTPServerDisconnected:
        #retcode = 3
        response_object = {
            'status': 'fail',
            'message': ' SMTPServer Disconnected.',
        }
        return response_object, 200
    except SMTPException:
        #retcode = 1
        response_object = {
            'status': 'fail',
            'message': ' SMTPServer Exception.',
        }
        return response_object, 200
    '''