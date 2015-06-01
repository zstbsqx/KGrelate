#-*-coding:utf-8-*- 
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
  return app.send_static_file('apidemo.html')

@app.route('/pub/<name>')
def pub(name):
  par = {
    'query': name,
    'size': 5,
    'sort': 'relevance',
    'offset': 0
  }
  raw = requests.get('http://api.aminer.org/api/search/pub', params = par)
  dic = raw.json()
  res = []
  for k in dic["result"]:
    paper = {}
    paper["title"] = k["title"] if "title" in k else None
    paper["title_zh"] = k["title_zh"] if "title_zh" in k else None
    paper["authors"] = k["authors"] if "authors" in k else None
    paper["venue"] = k["venue"] if "venue" in k else None
    paper["year"] = k["year"] if "year" in k else None
    paper["n_citation"] = k["n_citation"] if "n_citation" in k else None
    res.append(paper)
  jsonRes = json.dumps(res, indent=2, separators=(',', ': '))
  print jsonRes
  return jsonRes

@app.route('/pub/<name>/detail')
def pubDetail(name):
  par = {
    'query': name,
    'size': 5,
    'sort': 'relevance',
    'offset': 0
  }
  raw = requests.get('http://api.aminer.org/api/search/pub', params = par)
  dic = raw.json()
  res = []
  for k in dic["result"]:
    paper = {}
    paper["abstract"] = k["abstract"] if "abstract" in k else None
    paper["abstract_zh"] = k["abstract_zh"] if "abstract_zh" in k else None
    res.append(paper)
  jsonRes = json.dumps(res, indent=2, separators=(',', ': '))
  print jsonRes
  return jsonRes

@app.route('/people/<name>')
def people(name):
  par = {
    'query': name,
    'size': 5,
    'sort': 'relevance',
    'offset': 0
  }
  raw = requests.get('http://api.aminer.org/api/search/people', params = par)
  dic = raw.json()
  #多个搜索结果以列表形式返回，每一项是一个词典
  #注意返回结果可能为None，因为Amine的api中可能没有这一项
  res = []
  for k in dic["result"]:
    person = {}
    person["id"] = k["id"] if "id" in k else None
    person["name"] = k["name"] if "name" in k else None
    person["name_zh"] = k["name_zh"] if "name_zh" in k else None
    person["image"] = k["img"] if "img" in k else None
    person["org"] = k["org"] if "org" in k else None
    person["org_zh"] = k["org_zh"] if "org_zh" in k else None
    person["tags"] = k["tags"] if "tags" in k else None
    person["h_index"] = k["h_index"] if "h_index" in k else None
    person["n_pubs"] = k["n_pubs"] if "n_pubs" in k else None
    person["n_citation"] = k["n_citation"] if "n_citation" in k else None
    res.append(person)
    # person[""] = k[""] if "" in k else None
  jsonRes = json.dumps(res, indent=2, separators=(',', ': '))
  print jsonRes
  return jsonRes

@app.route('/people/<name>/detail')
def peopleDetail(name):
  par = {
    'query': name,
    'size': 5,
    'sort': 'relevance',
    'offset': 0
  }
  raw = requests.get('http://api.aminer.org/api/search/people', params = par)
  dic = raw.json()
  #多个搜索结果以列表形式返回，每一项是一个词典
  #注意返回结果可能为None，因为Amine的api中可能没有这一项
  res = []
  for k in dic["result"]:
    person = {}
    person["id"] = k["id"] if "id" in k else None
    person["contact"] = k["contact"] if "contact" in k else None
    similar = []
    if "similarPersons" in k:
      for i in k["similarPersons"]:
        j = {}
        j["id"] = i["id"] if "id" in i else None
        j["name"] = i["name"] if "name" in i else None
        j["image"] = i["img"] if "img" in i else None
        similar.append(j)
      person["similarPersons"] = similar
    else:
      person["similarPersons"] = None
    res.append(person)
    # person[""] = k[""] if "" in k else None
  jsonRes = json.dumps(res, indent=2, separators=(',', ': '))
  print jsonRes
  return jsonRes
  
@app.route('/entity/<name>')
def entity(name):
  raw = requests.get('http://api.aminer.org/api/search/entity/' + name)
  dic = raw.json()
  res = []
  for k in dic:
    entity = {}
    entity["title"] = k["title"] if "title" in k else None
    entity["image"] = k["image"][0] if "image" in k else None
    res.append(entity)
  jsonRes = json.dumps(res, indent=2, separators=(',', ': '))
  print jsonRes
  return jsonRes

@app.route('/entity/<name>/detail')
def entityDetail(name):
  raw = requests.get('http://api.aminer.org/api/search/entity/' + name)
  dic = raw.json()
  res = []
  for k in dic:
    entity = {}
    entity["url"] = k["url"] if "url" in k else None
    entity["image"] = k["image"] if "image" in k else None
    entity["abstract"] = k["abstract"] if "abstract" in k else None
    entity["super_topic"] = k["super_topic"] if "super_topic" in k else None
    entity["related_item"] = k["related_item"] if "related_item" in k else None
    entity["type"] = k["type"] if "type" in k else None
    res.append(entity)
  jsonRes = json.dumps(res, indent=2, separators=(',', ': '))
  print jsonRes
  return jsonRes

if __name__ == '__main__':
  app.run(debug=True)