from flask_restplus import Namespace, fields

class RedisDto:
    api = Namespace('redis', description='redis related operations')
    
class AkunDto:
    api = Namespace('akun', description='akun related operations')
    akun_auth = api.model('akun_details', {
        'username': fields.String(required=True, description='The username'),
        'password': fields.String(required=True, description='The password '),
    })

class CswDto:
    api = Namespace('csw', description='csw related operations')

class DownloadDto:
    api = Namespace('download', description='download related operations')
    # download = api.model('user', {
    #     'filename': fields.String(required=True, description='name of file'),
    # })

class StatisticDto:
    api = Namespace('statistic', description='statistic download demnas')
    statistic = api.model('Statistic',{
        # 'id': fields.Integer(required=True, description='id auto increment'),
        'username': fields.String(required=True, description='username'),
        'created_date': fields.DateTime(description='datetime data created'),
        'file_name': fields.String(required=True, description='file name'),
    })

class RegisterDto:
    api = Namespace('register', description='register related operations')
    # download = api.model('user', {
    #     'filename': fields.String(required=True, description='name of file'),
    # })

class QueryDto:
    api = Namespace('query', description='query related operations')
    # download = api.model('user', {
    #     'filename': fields.String(required=True, description='name of file'),
    # })

class ContinentsDto:
    api = Namespace('continents', description='continents related operations')
    schema = api.model('continents', {
        'id': fields.Integer(dump_only=True),
        'name': fields.String(required=True, description='continents name')
    })

class CountriesDto:
    api = Namespace('countries', description='countries related operations')
    schema = api.model('countries', {
        'id': fields.Integer(dump_only=True),
        'name': fields.String(required=True, description='country name')
    })
    schema_continent = api.model('countries', {
        'id': fields.Integer(dump_only=True),
        'name': fields.String(required=True, description='region name'),
        'continent' : fields.Nested(ContinentsDto().schema, only=['id', 'name'], required=True)
    })

class ProvincesDto:
    api = Namespace('provinces', description='provinces related operations')
    schema = api.model('provinces', {
        'id': fields.Integer(dump_only=True),
        'name': fields.String(required=True, description='province name')
    })
    schema_countries = api.model('provinces', {
        'id': fields.Integer(dump_only=True),
        'name': fields.String(required=True, description='province name'),
        'country' : fields.Nested(ContinentsDto().schema, only=['id', 'name'], required=True)
    })


class RegionsDto:
    api = Namespace('regions', description='regions related operations')
    schema = api.model('regions', {
        'id': fields.Integer(dump_only=True),
        'name': fields.String(required=True, description='region name')
    })
    
    schema_province = api.model('regions', {
        'id': fields.Integer(dump_only=True),
        'name': fields.String(required=True, description='region name'),
        'province' : fields.Nested(ProvincesDto().schema, only=['id', 'name'], required=True)
    })

class OrganizationsDto:
    api = Namespace('organizations', description='organizations related operations')
    schema = api.model('organizations', {
        'id': fields.Integer(dump_only=True),
        'name': fields.String(required=True, description='organization name'),
        'csw': fields.String(required=True, description='csw url'),
    })
    schema2 = api.model('organizations', {
        'id': fields.Integer(dump_only=True),
        'name': fields.String(required=True, description='organization name')
    })
    entry = api.model('organizations', {
        'name': fields.String(required=True, description='organization name'),
        'csw': fields.String(required=True, description='csw url'),
    })
    update = api.model('organizations', {
        'id': fields.Integer(required=True, description='id'),
        'name': fields.String(required=True, description='organization name'),
        'csw': fields.String(required=True, description='csw url'),
    })
    delete = api.model('organizations', {
        'id': fields.Integer(required=True, description='id'),
    })

class MetadataDto:
    api = Namespace('metadata', description='metadata related operations')
    schema = api.model('metadata', {
        'id': fields.Integer(dump_only=True),
        'filename': fields.String(required=True, description='metadata name'),
        'validated': fields.Boolean(),
        'status': fields.Boolean(),
        'time_uploaded': fields.DateTime(description='datetime metadata uploaded')
    })
    schema2 = api.model('metadata', {
        'id': fields.Integer(dump_only=True),
        'filename': fields.String(required=True, description='metadata name')
    })
    entry = api.model('metadata', {
        'filename': fields.String(required=True, description='metadata name'),
    })
    update = api.model('metadata_update', {
        'id': fields.Integer(required=True, description='id'),
        'filename': fields.String(required=True, description='file name'),
        'status': fields.Boolean()
    })
    updateAdmin = api.model('metadata_update_admin', {
        'id': fields.Integer(required=True, description='id'),
        'statusMetadata': fields.String(required=True)
    })
    delete = api.model('metadata_delete', {
        'id': fields.Integer(required=True, description='id'),
    })

class ContributionDto:
    api = Namespace('contribution', description='contribution related operations')
    schema = api.model('contributions', {
        'id': fields.Integer(dump_only=True),
        'data_name': fields.String(required=True, description='data name'),
        'filename': fields.String(required=True, description='file name'),
        'time_uploaded': fields.DateTime(description='datetime metadata uploaded'),
        'url': fields.String(required=True, description='file name')
    })
    schema2 = api.model('contributions', {
        'id': fields.Integer(dump_only=True),
        'name': fields.String(required=True, description='data name'),
        'filename': fields.String(required=True, description='file name')
    })
    entry = api.model('Contributions', {
        'name': fields.String(required=True, description='data name'),
        'filename': fields.String(required=True, description='file name'),
        'username': fields.String(required=True, description='username'),
        'url': fields.String(required=True, description='url')
    })
    update = api.model('contributions', {
        'id': fields.Integer(required=True, description='id'),
        'name': fields.String(required=True, description='data name'),
        'filename': fields.String(required=True, description='file name'),
        'url':fields.String(required=True, description='url')
    })
    delete = api.model('contribution', {
        'id': fields.Integer(required=True, description='id'),
    })


class HarvestingsDto:
    api = Namespace('harvestings', description='harvestings related operations')
    schema = api.model('harvestings', {
        'id': fields.Integer(dump_only=True),
        'title': fields.String(required=True, description='title name'),
        'abstract': fields.String(required=True, description='abstract'),
        'filename': fields.String(required=True, description='filename'),
        'organizations' : fields.Nested(OrganizationsDto().schema2, only=['id', 'name'], required=True)
    })
    schema2 = api.model('harvestings', {
        'id': fields.Integer(dump_only=True),
        'title': fields.String(required=True, description='title name'),
        'abstract': fields.String(required=True, description='abstract'),
        'organizations' : fields.Nested(OrganizationsDto().schema2, only=['id', 'name'], required=True),
        'data_type': fields.String(required=True, description='data type'),
        'identifier': fields.String(required=True, description='identifier'),
        'publication_date': fields.DateTime(required=True, description='data type'),
        'distributions': fields.String(required=True, description='data type'),
        'categories': fields.String(required=True, description='subjects'),
        'keywords': fields.String(required=True, description='keywords'),
        'filename': fields.String(required=True, description='filename')
    })
    delete = api.model('harvestings_delete', {
        'identifier': fields.String(required=True, description='identifier'),
        'filename': fields.String(required=True, description='filename'),
    })
    #bbox = db.Column(Geometry('POLYGON', srid='4326'))

class ThemesDto:
    api = Namespace('themes', description='themes related operations')
    schema = api.model('themes', {
        'id': fields.Integer(dump_only=True),
        'name': fields.String(required=True, description='theme name')
    })
    entry = api.model('themes', {
        'name': fields.String(required=True, description='theme name')
    })
    update = api.model('themes', {
        'id': fields.Integer(required=True, description='id'),
        'name': fields.String(required=True, description='theme name')
    })
    delete = api.model('delete_theme', {
        'id': fields.Integer(required=True, description='id'),
    })

class KeywordsDto:
    api = Namespace('keywords', description='keywords related operations')
    schema = api.model('keywords', {
        'id': fields.Integer(dump_only=True),
        'name': fields.String(required=True, description='keywords name')
    })
    entry = api.model('keywords', {
        'name': fields.String(required=True, description='keywords name')
    })
    update = api.model('keywords_update', {
        'id': fields.Integer(required=True, description='id'),
        'name': fields.String(required=True, description='keywords name')
    })
    delete = api.model('delete_keywords', {
        'id': fields.Integer(required=True, description='id'),
    })

class AuthDto:
    api = Namespace('auth', description='authentication related operations')
    user_auth = api.model('auth_details', {
        'token': fields.String(required=True, description='The token'),
        'email': fields.String(required=True, description='The email'),
        'password': fields.String(required=True, description='The user password ')
    })
    forgot_auth = api.model('auth_forgot', {
        'email': fields.String(required=True, description='The email'),
    })

class UserDto:
    api = Namespace('user', description='user related operations')
    schema = api.model('user', {
        'fullname': fields.String(required=True, description='user fullname'),
        'email': fields.String(required=True, description='user email address'),
        'public_id': fields.String(description='user identifier'),
        'is_activated': fields.Boolean(description='user status')
    })
    user = api.model('user', {
        'fullname': fields.String(required=True, description='user fullname'),
        'email': fields.String(required=True, description='user email address')
    })
    activities = api.model('user', {
        'id': fields.Integer(dump_only=True),
        'fullname': fields.String(required=True, description='user fullname'),
        'email': fields.String(required=True, description='user email address')
    })
    update = api.model('user_update', {
        'fullname': fields.String(required=True, description='user fullname'),
        #'email': fields.String(required=True, description='user email address'),
        'public_id': fields.String(required=True, description='public_id'),
    })
    password = api.model('user_password', {
        'current_password': fields.String(required=True, description='user current password'),
        'new_password': fields.String(required=True, description='user new password'),
        'repeat_password': fields.String(required=True, description='user repeat password'),
        'public_id': fields.String(required=True, description='public_id'),
    })
    delete = api.model('user_delete', {
        'public_id': fields.String(required=True, description='public_id'),
    })

class ProxyDto:
    api = Namespace('proxy', description='proxy related operations')

class DataDto:
    api = Namespace('data', description='data related operations')

class ActivitiesDto:
    api = Namespace('activities', description='user activities')
    schema = api.model('Activities',{
        # 'id': fields.Integer(required=True, description='id auto increment'),
        'ip_address': fields.String(required=True, description='ip_address'),
        'modul': fields.String(required=True, description='modul'),
        'task': fields.String(required=True, description='task'),
        'data': fields.String(required=True, description='data'),
        'activity_time': fields.DateTime(description='activity time'),
        'status': fields.String(required=True, description='status'),
        'user' : fields.Nested(UserDto().activities, required=True)
    })