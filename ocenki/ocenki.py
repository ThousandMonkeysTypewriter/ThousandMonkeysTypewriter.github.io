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
  return [template('index').encode("utf-8")]

# run(host='thousandmon stypewriter.com', port=80, server="paste")
run(host='localhost', port=8000, debug=True)
