#!bin/python3

from bottle import route, run, template, request, static_file
import sys
import logging
import requests
import json

# URL = "http://138.201.200.88:1958"
URL = "http://78.46.103.68:1958"

@route('/assets/<filename:path>')
def st(filename):
    return static_file(filename, root="./assets/")

@route('/')
# show start form
def index():
  return [template('take_code_id', lang='html').encode("utf-8")]

def fileData(upload):
  separate = ''.join(['#' for i in range(10)])
  name = upload.filename
  content = upload.file.read().decode("utf-8")
  return "{0} {1} {0}\n {2}\n\n".format(separate, name, content)

@route('/reviews', method='POST')
def get_reviews():
  # postdata = request.body.read() // было до файла в форме
  req_id = request.forms.get("[id]").encode("utf-8")
  postdata = request.forms.get('code_id').encode('utf-8')
  if not postdata:
    uploads = request.files.getall('code_file');
    if len(uploads):
      if len(uploads) == 1:
        postdata = uploads[0].file.read().decode("utf-8")
      else:
        postdata = "".join(map(fileData, uploads))
    print(postdata)
  lang = request.forms.get('lang')
  if lang == 'html':
    try:
      headers = {'Accept-Encoding': 'identity', 'Content-type': 'application/json; charset=utf-8'}
      res = requests.post('/'.join([URL, 'highlight']), data = {'code_id':postdata, '[id]':req_id}, headers = headers)
      # print(res.content.decode('utf-8'))
    except Exception as ex:
      logging.warning("Exception; code_id: %s; message: %s", postdata, ex)
      return "<p>Fail: {ex}</p>".format(ex=ex)

    if res.status_code != 200:
      logging.warning("Status: %s; code_id: %s;", res.status_code, postdata)
      return "<p>Resp status: {res.status_code}</p>".format(res=res)
    else:
      res = res.content.decode('utf-8')
      return [template('take_code_id', code_id=postdata, lang=lang, res=res, uid = req_id)]
  else:
    return [template('take_code_id', code_id=postdata, lang=lang, res=postdata.encode("utf-8"), uid = None).encode("utf-8")]

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


# run(host='thousandmon stypewriter.com', port=80, server="paste")
run(host='localhost', port=8000, debug=True)
