#!bin/python3

from bottle import route, run, template, request, static_file
import sys
import logging

@route('/assets/<filename:path>')
def st(filename):
    return static_file(filename, root="./assets/")

@route('/')
# show start form
def index():
  with open('./weblist.txt') as f:
    lines = f.readlines()
  res = [l.strip() for l in lines if len(l.strip())]
  return [template('index', lines=res).encode("utf-8")]

# run(host='thousandmon stypewriter.com', port=80, server="paste")
run(host='localhost', port=8000, debug=True)
