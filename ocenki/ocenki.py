#!bin/python3

from bottle import route, run, template, request, static_file
import sys
import logging
import requests
import json

URL = "http://138.201.200.88:1958"
URL1 = "http://138.201.200.88:1958"
#URL = "http://78.46.103.68:1958"

@route('/assets/<filename:path>')
def st(filename):
    return static_file(filename, root="./assets/")
	
@route('/')
def index():
  return [template('take_code_id').encode("utf-8")]

@route('/reviews', method='POST')
def get_reviews():
  postdata = request.body.read()
  try:
    headers = {'Accept-Encoding': 'identity', 'Content-type': 'application/json; charset=utf-8'}
    res = requests.post('/'.join([URL, 'highlight']), data = postdata, headers = headers)
    # print(res.content.decode('utf-8'))
  except Exception as ex:
    logging.warning("Exception; code_id: %s; message: %s", request.forms.get("code_id"), ex)
    return "<p>Fail: {ex}</p>".format(ex=ex)

  if res.status_code != 200:
    logging.warning("Status: %s; code_id: %s;", res.status_code, request.forms.get("code_id"))
    return "<p>Resp status: {res.status_code}</p>".format(res=res)
  else:
    res = res.content.decode('utf-8')
    return [template('take_code_id', code_id=request.forms.get("code_id"), res=res, uid = request.forms.get("[id]")).encode("utf-8")]

@route('/raw', method='POST')
def get_raw():
  postdata = request.body.read()
  try:
    headers = {'Accept-Encoding': 'identity', 'Content-type': 'text/plain; charset=utf-8'}
    res = requests.post('/'.join([URL, 'raw']), data = postdata, headers = headers)
  except Exception as ex:
    logging.warning("Exception; code_id: %s; message: %s", code_id, ex)
    return "<p>Fail: {ex}</p>".format(ex=ex)
  if res.status_code != 200:
    logging.warning("Status: %s; code_id: %s;", res.status_code, code_id)
    return "<p>Resp status: {res.status_code}</p>".format(res=res)
  else:
    res = res.content.decode('utf-8')
    return [res.encode("utf-8")]	

@route('/save', method='POST')
def get_save():
  postdata = request.body.read()
  data_ = request.forms.get("data")
  try:
    headers = {'Accept-Encoding': 'identity', 'Content-type': 'text/plain; charset=utf-8'}
    res = requests.post('/'.join([URL, 'save']), data = postdata, headers = headers)
  except Exception as ex:
    logging.warning("Exception; data: %s; message: %s", data_, ex)
    return "500"
  return "{res.status_code}".format(res=res)

@route('/yandex/assets/<filename:path>')
def st(filename):
    return static_file(filename, root="./assets/")

@route('/yandex')
def index():
  return [template('take_code_id_si').encode("utf-8")]

@route('/yandex/reviews', method='POST')
def get_reviews():
  postdata = request.body.read()
  try:
    headers = {'Accept-Encoding': 'identity', 'Content-type': 'application/json; charset=utf-8'}
    res = requests.post('/'.join([URL1, 'highlight']), data = postdata, headers = headers)
    # print(res.content.decode('utf-8'))
  except Exception as ex:
    logging.warning("Exception; code_id: %s; message: %s", request.forms.get("code_id"), ex)
    return "<p>Fail: {ex}</p>".format(ex=ex)

  if res.status_code != 200:
    logging.warning("Status: %s; code_id: %s;", res.status_code, request.forms.get("code_id"))
    return "<p>Resp status: {res.status_code}</p>".format(res=res)
  else:
    res = res.content.decode('utf-8')
    return [template('take_code_id_si', code_id=request.forms.get("code_id"), res=res, uid = request.forms.get("[id]")).encode("utf-8")]

@route('/yandex/raw', method='POST')
def get_raw():
  postdata = request.body.read()
  try:
    headers = {'Accept-Encoding': 'identity', 'Content-type': 'text/plain; charset=utf-8'}
    res = requests.post('/'.join([URL1, 'raw']), data = postdata, headers = headers)
  except Exception as ex:
    logging.warning("Exception; code_id: %s; message: %s", code_id, ex)
    return "<p>Fail: {ex}</p>".format(ex=ex)
  if res.status_code != 200:
    logging.warning("Status: %s; code_id: %s;", res.status_code, code_id)
    return "<p>Resp status: {res.status_code}</p>".format(res=res)
  else:
    res = res.content.decode('utf-8')
    return [res.encode("utf-8")]	  
#@route('/demo')
#def get_screencasts():
#  return [template('screens').encode("utf-8")]


# run(host='thousandmon stypewriter.com', port=80, server="paste")
run(host='h03.htz17.i.detectum.com', port=8080, debug=True)
