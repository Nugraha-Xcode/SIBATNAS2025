from app.main.model.user import User
from app.main.model.activities import Activities

from ..service.blacklist_service import save_token

from app.main import db#, mail

#from flask_mail import Message
#from smtplib import SMTPAuthenticationError, SMTPConnectError, SMTPServerDisconnected, SMTPException
import re
import random
import datetime
import string
import requests
from requests.exceptions import HTTPError
import json
import os
import redis
from datetime import timedelta
from app.main.service.redis_helper import SessionStore

from ..service.network_helper import get_ip_client

REDIS_URL = os.environ.get('REDIS_URL', 'redis://redis:6379')
GOOGLE_URL = os.environ.get('GOOGLE_URL',"https://www.google.com/recaptcha/api/siteverify?secret=6LdXlSweAAAAAAtZGm7WjAKoYMXjGAKD9Ug1Ukkp&response=")

class Auth:

    @staticmethod
    def login_user(data):
        try:
            # fetch the user data            
            payload={}
            headers = {}
            response = requests.request("POST", GOOGLE_URL+data.get('token'), headers=headers, data=payload)
            print(response.json()) 
            resp = response.json()
            if resp['success'] == True:
                r = redis.Redis(host='redis', port=6379, db=5)
                if not r.exists(data['email']):
                    r.hmset(data['email'], {"failed": 5,"time": ""})
                nleft = r.hget(data['email'], "failed")
                if nleft > b"1":
                    user = User.query.filter_by(email=data.get('email')).first()
                    print(user)
                    if user and user.check_password(data.get('password')):
                        auth_token = user.encode_auth_token(user.id)
                        #print(auth_token)
                        if auth_token:
                            r.delete(data['email'])
                            
                            if not r.exists(auth_token.decode()):
                                r.hmset(auth_token.decode(), {"email": user.email,"public_id": user.public_id})
                            if r.ttl(auth_token.decode()) == -1:
                                r.expire(auth_token.decode(), timedelta(minutes=15))
                            #print(get_ip_client())
                            new_activity = Activities(
                                ip_address = get_ip_client(),
                                modul = "Auth",
                                task = "Login",
                                data = "email=" + data['email'],
                                activity_time = datetime.datetime.utcnow()+ datetime.timedelta(hours=7),
                                status = "success",
                                user_id = user.id
                            )
                            db.session.add(new_activity)
                            db.session.commit()
                            response_object = {
                                'status': 'success',
                                'message': 'Successfully logged in.',
                                'Authorization': auth_token.decode(),
                                'email': user.email,
                                'public_id': user.public_id
                            }
                            return response_object, 200
                    else:
                        r.hincrby(data['email'], "failed", -1)
                        new_activity = Activities(
                                ip_address = get_ip_client(),
                                modul = "Auth",
                                task = "Login",
                                data = "email=" + data['email'],
                                activity_time = datetime.datetime.utcnow()+ datetime.timedelta(hours=7),
                                status = "failed",
                                user_id = user.id
                            )
                        db.session.add(new_activity)
                        db.session.commit()
                        response_object = {
                            'status': 'fail',
                            'message': 'email or password is not valid. attempt left: {0}'.format(r.hget(data['email'], "failed").decode("utf-8"))
                        }
                        return response_object, 200
                else:
                    if r.ttl(data['email']) == -1:
                        r.expire(data['email'], timedelta(minutes=15)) 
                    response_object = {
                                    'status': 'fail',
                                    'message': 'maximum 5 attempts. wait {0} seconds'.format(r.ttl(data['email']))
                                }
                    return response_object, 200
            else:
                response_object = {
                    'status': 'fail',
                    'message': 'token recaptcha not valid.'
                }
                return response_object, 401

        except Exception as e:
            print(e)
            response_object = {
                'status': 'fail',
                'message': 'Try again'
            }
            return response_object, 500
    
    @staticmethod
    def login_admin(data):
        try:
            # fetch the user data
            payload={}
            headers = {}
            response = requests.request("POST", GOOGLE_URL+data.get('token'), headers=headers, data=payload)
            print(response.json()) 
            resp = response.json()
            if resp['success'] == True:
                r = redis.Redis(host='redis', port=6379, db=5)
                if not r.exists(data['email']):
                    r.hmset(data['email'], {"failed": 5,"time": ""})
                nleft = r.hget(data['email'], "failed")
                if nleft > b"1":
                    user = User.query.filter_by(email=data.get('email'), admin=True).first()
                    print(user)
                    if user and user.check_password(data.get('password')):
                        auth_token = user.encode_auth_token(user.id)
                        #print(auth_token)
                        if auth_token:
                            r.delete(data['email'])
                            
                            if not r.exists(auth_token.decode()):
                                r.hmset(auth_token.decode(), {"email": user.email,"public_id": user.public_id})
                            if r.ttl(auth_token.decode()) == -1:
                                r.expire(auth_token.decode(), timedelta(minutes=15))
                            new_activity = Activities(
                                ip_address = get_ip_client(),
                                modul = "Auth",
                                task = "Login",
                                data = "email=" + data['email'],
                                activity_time = datetime.datetime.utcnow()+ datetime.timedelta(hours=7),
                                status = "success",
                                user_id = user.id
                            )
                            db.session.add(new_activity)
                            db.session.commit()
                            response_object = {
                                'status': 'success',
                                'message': 'Successfully logged in.',
                                'Authorization': auth_token.decode(),
                                'email': user.email,
                                'public_id': user.public_id
                            }
                            return response_object, 200
                    else:
                        r.hincrby(data['email'], "failed", -1)
                        new_activity = Activities(
                                ip_address = get_ip_client(),
                                modul = "Auth",
                                task = "Login",
                                data = "email=" + data['email'],
                                activity_time = datetime.datetime.utcnow()+ datetime.timedelta(hours=7),
                                status = "failed",
                                user_id = user.id
                        )
                        db.session.add(new_activity)
                        db.session.commit()
                        response_object = {
                            'status': 'fail',
                            'message': 'email or password is not valid. attempt left: {0}'.format(r.hget(data['email'], "failed").decode("utf-8"))
                        }
                        return response_object, 200
                else:
                    if r.ttl(data['email']) == -1:
                        r.expire(data['email'], timedelta(minutes=15)) 
                    response_object = {
                                    'status': 'fail',
                                    'message': 'maximum 5 attempts. wait {0} seconds'.format(r.ttl(data['email']))
                                }
                    return response_object, 200
            else:
                response_object = {
                    'status': 'fail',
                    'message': 'token recaptcha not valid.'
                }
                return response_object, 401

        except Exception as e:
            print(e)
            response_object = {
                'status': 'fail',
                'message': 'Try again'
            }
            return response_object, 500

    @staticmethod
    def logout_user(data):
        #print(auth_token)
        if data:
            r = redis.Redis(host='redis', port=6379, db=5)
            if r.exists(data):
                mail_user = r.hget(data, "email").decode()
                user = User.query.filter_by(email=mail_user).first()
                    
                r.delete(data)
                new_activity = Activities(
                        ip_address = get_ip_client(),
                        modul = "Auth",
                        task = "Logout",
                        data = "token=" + data,
                        activity_time = datetime.datetime.utcnow() + datetime.timedelta(hours=7),
                        status = "success",
                        user_id = user.id
                    )
                db.session.add(new_activity)
                db.session.commit()
                response_object = {
                    'status': 'success',
                    'message': 'Successfully logged out.'
                }
                return response_object, 200
            else:
                response_object = {
                    'status': 'fail',
                    'message': 'Provide a valid auth token.'
                }
                return response_object, 403
        '''
        #print(data)
        if data:
            auth_token = data #data.split(" ")[1]
        else:
            auth_token = ''
        print(auth_token + " --- ")
        if auth_token:
            resp = User.decode_auth_token(auth_token)
            if not isinstance(resp, str): #not
                # mark the token as blacklisted
                return save_token(token=auth_token)
            else:
                response_object = {
                    'status': 'fail',
                    'message': resp
                }
                return response_object, 401
        else:
            response_object = {
                'status': 'fail',
                'message': 'Provide a valid auth token.'
            }
            return response_object, 403
        '''
    @staticmethod
    def forgot_admin(data):
        try:
            # fetch the user data
            user = User.query.filter_by(email=data.get('email'), admin=True).first()
            print(user)
            if user:
                    #send email notification
                    password = user_random_generator()
                    setattr(user, 'password', password)
                    new_activity = Activities(
                        ip_address = get_ip_client(),
                        modul = "Auth",
                        task = "Forgot",
                        data = "email=" + data.get('email'),
                        activity_time = datetime.datetime.utcnow()+ datetime.timedelta(hours=7),
                        status = "success",
                        user_id = user.id
                    )
                    db.session.add(new_activity)
                    db.session.commit()

                    return send_email(user.email, password, 'Walidata')
            else:
                response_object = {
                    'status': 'fail',
                    'message': 'email is not found.'
                }
                return response_object, 200
        except Exception as e:
            print(e)
            response_object = {
                'status': 'fail',
                'message': 'Try again'
            }
            return response_object, 200

    @staticmethod
    def forgot(data):
        try:
            # fetch the user data
            user = User.query.filter_by(email=data.get('email'), admin=False).first()
            print(user)
            if user:
                    #send email notification
                    password = user_random_generator()
                    setattr(user, 'password', password)
                    new_activity = Activities(
                        ip_address = get_ip_client(),
                        modul = "Auth",
                        task = "Forgot",
                        data = "email=" + data.get('email'),
                        activity_time = datetime.datetime.utcnow()+ datetime.timedelta(hours=7),
                        status = "success",
                        user_id = user.id
                    )
                    db.session.add(new_activity)
                    db.session.commit()

                    return send_email(user.email, password, 'Produsen')
            else:
                response_object = {
                    'status': 'fail',
                    'message': 'email is not found.'
                }
                return response_object, 200

        except Exception as e:
            print(e)
            response_object = {
                'status': 'fail',
                'message': 'Try again'
            }
            return response_object, 200
    
    @staticmethod
    def get_logged_in_user(new_request):
        # get the auth token
        #print(new_request.headers)
        auth_token = new_request.headers.get('Authorization')
        #print(auth_token)
        if auth_token:
            r = redis.Redis(host='redis', port=6379, db=5)
            if r.exists(auth_token):
                if r.ttl(auth_token) <= -1:
                    response_object = {
                    'status': 'fail',
                    'message': 'token is expired'
                    }
                    return response_object, 401
                else:
                    mail_user = r.hget(auth_token, "email").decode()
                    user = User.query.filter_by(email=mail_user).first()
                    response_object = {
                        'status': 'success',
                        'data': {
                            'user_id': user.public_id,
                            'email': user.email,
                            'admin': user.admin
                            #'registered_on': str(user.registered_on)
                        }
                    }
                    return response_object, 200
            else:
                response_object = {
                'status': 'fail',
                'message': 'token is not found'
                }
                return response_object, 401
            '''
            resp = User.decode_auth_token(auth_token)
            #print(resp)
            #print(type(resp))
            if not isinstance(resp, str):
                user = User.query.filter_by(id=resp).first()
                response_object = {
                    'status': 'success',
                    'data': {
                        'user_id': user.public_id,
                        'email': user.email,
                        'admin': user.admin
                        #'registered_on': str(user.registered_on)
                    }
                }
                return response_object, 200
            response_object = {
                'status': 'fail',
                'message': resp
            }
            return response_object, 401
            '''
        else:
            response_object = {
                'status': 'fail',
                'message': 'Provide a valid auth token.'
            }
            return response_object, 401
    
    
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


def user_input_password_check(password):
    #atleast 8 character long
    if len(password) >= 8 and uppercase_check(password) and lowercase_check(password) and digit_check(password):
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
    "subject": "[SIKAMBING] User Forgot Password",
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
    "subject": "[SIKAMBING] User Forgot Password",
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