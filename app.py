from flask import Flask, request
import requests
import json
app = Flask(__name__)

@app.route('/')
def hello():
  usageList = ['usage:', '/pub/*', '/people/*', '/entity/*', '', 'demo:', '/demo']
  return '<br>'.join(usageList)

@app.route('/demo')
def demo():
  return app.send_static_file('demo.html')

@app.route('/pub/<name>')
def pub(name):
  par = {
    'query': name,
    'size': 5,
    'sort': 'relevance',
    'offset': 0
  }
  res = requests.get('http://api.aminer.org/api/search/pub', params = par)
  jsonRes = json.dumps(res.json(), indent=2, separators=(',', ': '))
  print(jsonRes)
  return res.text
  
@app.route('/people/<name>')
def people(name):
  par = {
    'query': name,
    'size': 5,
    'sort': 'relevance',
    'offset': 0
  }
  res = requests.get('http://api.aminer.org/api/search/people', params = par)
  jsonRes = json.dumps(res.json(), indent=2, separators=(',', ': '))
  print(jsonRes)
  return res.text
  
@app.route('/entity/<name>')
def entity(name):
  res = requests.get('http://api.aminer.org/api/search/entity/' + name)
  jsonRes = json.dumps(res.json(), indent=2, separators=(',', ': '))
  print(jsonRes)
  return res.text
  
if __name__ == '__main__':
  app.run(debug=True)