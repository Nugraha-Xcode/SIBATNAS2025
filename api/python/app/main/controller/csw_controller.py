from flask_restplus import Resource
from flask import Flask, render_template, request, abort, Response, redirect
import requests

from ..util.dto import CswDto
from ..util.decorator import admin_token_required, token_required
from ..config import CSW_URL

api = CswDto.api
APPROVED_HOSTS = set(["google.com", "www.google.com", "yahoo.com"])
CHUNK_SIZE = 1024

@api.route('/')
class Csw(Resource):
    """
        Csw Resource
    """
    @api.doc('csw login')
    #@api.expect(user_auth, validate=True)
    @admin_token_required
    def get(self):
        """get operation"""
        #proxy_ref = proxy_ref_info(request)
        #print(proxy_ref)
        #return "get" + url
        #return redirect("http://www.google.com", code=200)
        r= requests.get(URL_CSW, stream=True , params = request.args, headers={})
        #def generate():
        #    for chunk in r.iter_content(CHUNK_SIZE):
        #        yield chunk
        #return Response(generate(), headers = {})
        return Response(r.raw.data, headers = {})
        """
        Don't use generate() in line 48 else you get truncated data if content is gzipped encoded.
Either use r.raw.data (and delete generate function) or iterate over r.raw.stream(decode_content=False) instead of r.iter_content()
"""
        """Fetches the specified URL and streams it out to the client.
        If the request was referred by the proxy itself (e.g. this is an image fetch for
        a previously proxied HTML page), then the original Referer is passed."""
        #r = get_source_rsp(url)
        #LOG.info("Got %s response from %s",r.status_code, url)
        #headers = dict(r.headers)
        #def generate():
        #    for chunk in r.iter_content(CHUNK_SIZE):
        #        yield chunk
        #return Response(generate(), headers = headers)

def get_source_rsp(url):
        url = 'http://%s' % url
        #LOG.info("Fetching %s", url)
        # Ensure the URL is approved, else abort
        if not is_approved(url):
            #LOG.warn("URL is not approved: %s", url)
            abort(403)
        # Pass original Referer for subsequent resource requests
        proxy_ref = proxy_ref_info(request)
        print(proxy_ref)
        headers = { "Referer" : "http://%s/%s" % (proxy_ref[0], proxy_ref[1])} if proxy_ref else {}
        # Fetch the URL, and stream it back
        #LOG.info("Fetching with headers: %s, %s", url, headers)
        print("Fetching with headers: %s, %s", url, headers)
        return requests.get(url, stream=True , params = request.args, headers=headers)

def is_approved(url):
    """Indicates whether the given URL is allowed to be fetched.  This
    prevents the server from becoming an open proxy"""
    host = split_url(url)[1]
    return host in APPROVED_HOSTS

def split_url(url):
    """Splits the given URL into a tuple of (protocol, host, uri)"""
    proto, rest = url.split(':', 1)
    rest = rest[2:].split('/', 1)
    host, uri = (rest[0], rest[1]) if len(rest) == 2 else (rest[0], "")
    return (proto, host, uri)

def proxy_ref_info(request):
    """Parses out Referer info indicating the request is from a previously proxied page.
    For example, if:
        Referer: http://localhost:8080/p/google.com/search?q=foo
    then the result is:
        ("google.com", "search?q=foo")
    """
    #print(request.headers.get('Referer'))
    ref = request.headers.get('Referer')
    if ref:
        _, _, uri = split_url(ref)
        print(uri)
        print(uri.find("/"))
        if uri.find("/") < 0:
            return None
        first, rest = uri.split("/", 1)
        print(first, rest)
        if first in "pd":
            parts = rest.split("/", 1)
            r = (parts[0], parts[1]) if len(parts) == 2 else (parts[0], "")
            #LOG.info("Referred by proxy host, uri: %s, %s", r[0], r[1])
            return r
    return None