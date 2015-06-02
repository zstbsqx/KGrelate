/*
 * Relate info manager
 * Load jQuery before load this lib
*/

var InfoManager = function (id) {
  if(!id) {
    return null;
  }
  this.dom = $('#' + id);
  this.show = {
    pubs: true,
    people: true,
    entity: false
  };
};
  
// $.get status: ("success", "notmodified", "nocontent", "error", "timeout", "abort", or "parsererror")
InfoManager.prototype.loadPubs = function (name, options) { //Arg options are for further dev
  console.log('loadpubs: ' + name);
  if(!this.show.pubs) {
    alert('pubs disabled');
    return this;
  }
  var dom = this.dom;
  $.get('/pubs/' + name, function (data, status) {
    if(status === 'success') {
      dom.empty();
      renderLayout(dom, 'pubs', data);
    } else {
      alert('load pubs failed, status:  ' + status);
      return this;
    }
  }, 'json');
  return this;
};

InfoManager.prototype.loadPeople = function (name, options) {
  console.log('loadpeople: ' + name);
  if(!this.show.people) {
    alert('people disabled');
    return this;
  }
  var dom = this.dom;
  $.get('/people/' + name, function (data, status) {
    if(status === 'success') {
      dom.empty();
      renderLayout(dom, 'people', data);
    } else {
      alert('load people failed, status:  ' + status);
      return this;
    }
  }, 'json');
  return this;
};

InfoManager.prototype.loadEntity = function (name, options) {
  console.log('do not need to implement');
  //do nothing
};

/*
  dom is a <li /> elem.
  data format:
    title, (title_zh), authors, venue, year, n_citation, id, 
    detail->{abstract, (abstract_zh)}  
*/

var renderPub = function (dom, data) {
  var summary = $('<div class="summary row" />'),
      detail = $('<ul class="detail accordion" data-accordion>');
};

/*
  data format:
    name, (name_zh), image, org, (org_zh), tags, h_index, n_pubs, n_citation, id,
    detail->{similarPersons->{name, image}, contact->{position, phone, email, fax, affiliation, address, interest, edu, work, bio, homepage, avatar}}
*/

var renderPerson = function(dom, data) {
  var id = 'persondetail_' + data.id;
  var summary = $('<div class="summary row" />'),
      detail = $('<ul class="detail accordion" data-accordion>'
                 + '<li class="accordion-navigation">'
                 + '<a href="#' + id + '">click for more details</a>'
                 + '<div id="' + id + '" class="content panel">Loading...</div>'
                 + '</li></ul>');
  //TODO: change 'loading...' to detail content
  summary.append('<div class="photo small-2 columns">'
                 + '<img class="th" src="' + data.image || '/static/image/default.jpg' + '">'
                 + '</div>');
  var info = $('<div class="small-10 columns" />');
  var name = data.name;
  if(data.name_zh) {
    name += '(' + data.name_zh + ')';
  }
  info.append('<div class="name">' + name + '</div>')
  var org = data.org;
  if(data.org_zh) {
    org += '(' + data.org_zh + ')';
  }
  info.append('<div class="org">' + org + '</div>')
//  if(data.contact.position) {
//    info.append('<div class="position">' + data.contact.position + '</div>');
//  }
  var pubinfo = $('<div class="pubinfo" />');
  pubinfo.append('pubinfo:');
  pubinfo.append('<span class="label">h_index : ' + data.h_index + '</span>');
  pubinfo.append('<span class="label">n_pubs : ' + data.n_pubs + '</span>');
  pubinfo.append('<span class="label">n_citation : ' + data.n_citation + '</span>');
  info.append(pubinfo);
  var tags = $('<div class="tags" />');
  tags.append('tags:');
  for(var i in data.tags) {
    tags.append('<span class="label tag">' + data.tags[i] +'</span>');
  }
  info.append(tags);
  summary.append(info);
  dom.append(summary);
  dom.append(detail);
  $(document).foundation();
};

//var renderEntity = function(item, data) {
//  console.log('do not need to implement');
//};

//type: pubs/people/entity
var renderLayout = function(dom, type, data) {
  console.log('renderlayout:\ntype: ' + type + '\ntarget dom: ' + dom);
  var id = 'relate_' + type;
  var main = dom.children(id);
  if(main.length === 0) {
    main = $('<div id="' + id+ '" />');
    dom.prepend(main);
    console.log('new main')
  }
  main.append('<div>Relate ' + type + ':</div>');
  var mainlist = $('<ul class="no-bullet" />');
  main.append(mainlist);
  for(var i in data) {
    console.log('loop: ' + i);
    item = $('<li />');
    mainlist.append(item);
    switch(type) {
      case 'pubs':
        renderPub(item, data[i]);
        break;
      case 'people':
        renderPerson(item, data[i]);
        break;
        //        case 'entity':
        //          renderEntity(item, data[i]);
        //          break;
      default:
        console.log('invalid type to render');
        break;
    }
  }
};
