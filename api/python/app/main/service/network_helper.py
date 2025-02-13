from flask import request


def get_ip_client():
    '''
    print(request.remote_addr)
    print(request.__dict__)
    print(request.headers.__dict__)
    print(request.headers['x-forwarded-for'])
    print(request.headers.get('X-Forwarded-For'))
    print(request.headers.get('X-Real-IP'))
    console.log(">>>", req.headers['x-forwarded-for'] );// returned a valid IP address 
console.log(">>>", req.headers['X-Real-IP'] ); // did not work returned undefined 
console.log(">>>", req.connection.remoteAddress )
    '''
    if request.environ.get('HTTP_X_FORWARDED_FOR') is None:
        print("REMOTE_ADDR")
        return(request.environ['REMOTE_ADDR'])
    else:
        print("HTTP_X_FORWARDED_FOR")
        return(request.environ['HTTP_X_FORWARDED_FOR'])