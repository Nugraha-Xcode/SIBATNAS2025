import uuid
import datetime
import re
import random
import string
import json
from app.main import db#, mail
from app.main.model.activities import Activities
from ..service.network_helper import get_ip_client

#from flask_mail import Message
from smtplib import SMTPAuthenticationError, SMTPConnectError, SMTPServerDisconnected, SMTPException
import requests
from requests.exceptions import HTTPError


def get_all_activities():
    return Activities.query.order_by('activities_id').limit(100).all()