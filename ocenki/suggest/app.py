import json
from bottle import route, run, request, response
from class_suggest import get_closest

@route('/query')
def index():
    response.content_type = 'application/json'
    response.headers['Access-Control-Allow-Origin'] = '*'
    prefix = request.query.q
    suggestions = get_closest(prefix, 10)
    return json.dumps(suggestions)

run(host='0.0.0.0', port=8080)