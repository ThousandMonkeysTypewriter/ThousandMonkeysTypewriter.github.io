#!bin/python3

from bottle import auth_basic, route, run, template, request, static_file
import sys
import logging
import json
import requests
from pathlib import Path
import re

def is_authenticated_user(user, password):
  return (user == 'hh' and password == 'otkrito')

@route('/assets/<filename:path>')
def st(filename):
    return static_file(filename, root="./assets/")

@route('/')
@auth_basic(is_authenticated_user)
def index():
  return ''

@route('/favicon.ico')
def index():
  return ''

@route('/<vacancy_id>')
@auth_basic(is_authenticated_user)
# show start form
def vacancy(vacancy_id):
  if not vacancy_id:
    return ''

  if(vacancy_id == 'test'):
    p = Path('./example.json')
    with p.open() as f:
      json_data = json.load(f)
    json_data['vac']['vacancyView']['description'] = unescape(json_data['vac']['vacancyView']['description'])
    return [template('index', vacancy=json_data, json_tabs=json.dumps(json_data['tabs'])).encode("utf-8")]

  try:
    headers = {'Accept-Encoding': 'identity', 'Content-type': 'application/json; charset=utf-8'}
    res = requests.get('/'.join(['http://prog.ai:1078', 'highlight']), params = {'id':vacancy_id}, headers = headers)
  except Exception as ex:
    logging.warning("Exception; vacancy_id: %s; message: %s", vacancy_id, ex)
    return "<p>Fail: {ex}</p>".format(ex=ex)
  
  if res.status_code != 200:
    logging.warning("Status: %s; code_id: %s;", res.status_code, vacancy_id)
    return "<p>Resp status: {res.status_code}</p>".format(res=res)
  else:
    json_data = res.json()
    json_data['vac']['vacancyView']['description'] = unescape(json_data['vac']['vacancyView']['description'])
    return [template('index', vacancy=json_data, json_tabs=json.dumps(json_data['tabs'])).encode("utf-8")]
  
  # p = Path('./example.json')
  # with p.open() as json_file:
  #   json_data = json.load(json_file)
   
def unescape(s):
  s = s.replace("&lt;", "<")
  s = s.replace("&gt;", ">")
  # this has to be last:
  s = s.replace("&amp;", "&")
  return s

# run(host='thousandmon stypewriter.com', port=80, server="paste")
run(host='localhost', port=8000, debug=True)
