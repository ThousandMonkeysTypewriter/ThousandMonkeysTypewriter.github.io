#!bin/python3

from bottle import route, run, template, request
import sys
import logging
import requests
import json


@route('/')
def index():
  return template('take_code_id')

@route('/reviews', method='POST')
def get_reviews():
  code_id = request.forms.get("code_id")
  try:
    headers = {'Accept-Encoding': 'identity', 'Content-type': 'text/plain; charset=utf-8'}
    res = requests.post('http://78.46.103.68:1958/highlight', data = code_id, headers = headers)
    # print(res.content.decode('utf-8'))
  except Exception as ex:
    logging.warning("Exception; code_id: %s; message: %s", code_id, ex)
    return "<p>Fail: {ex}</p>".format(ex=ex)

  if res.status_code != 200:
    logging.warning("Status: %s; code_id: %s; message: %s", res.status_code, code_id, ex)
    return "<p>Resp status: {res.status_code}</p>".format(res=res)
  else:
    res = res.content.decode('utf-8')
    return template('take_code_id', code_id=code_id, res=res)

@route('/raw', method='POST')
def get_raw():
  code_id = request.forms.get("code_id")
  try:
    headers = {'Accept-Encoding': 'identity', 'Content-type': 'text/plain; charset=utf-8'}
    res = requests.post('http://78.46.103.68:1958/raw', data = code_id, headers = headers)
  except Exception as ex:
    logging.warning("Exception; code_id: %s; message: %s", code_id, ex)
    return "<p>Fail: {ex}</p>".format(ex=ex)
  if res.status_code != 200:
    logging.warning("Status: %s; code_id: %s; message: %s", res.status_code, code_id, ex)
    return "<p>Resp status: {res.status_code}</p>".format(res=res)
  else:
    res = res.content.decode('utf-8')
    return res



# run(host='localhost', port=8080)
run(host='thousandmonkeystypewriter.com', port=80)
