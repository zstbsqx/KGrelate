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

InfoManager.prototype.load = function(name, options) {
  this.loadPubs(name, options);
  this.loadPeople(name, options);
};

// $.get status: ("success", "notmodified", "nocontent", "error", "timeout", "abort", or "parsererror")
InfoManager.prototype.loadPubs = function (name, options) { //Arg options are for further dev
  console.log('loadpubs: ' + name);
  if(!this.show.pubs) {
    alert('pubs disabled');
    return this;
  }
  var dom = this.dom;
  $.get('/api/relatedpubs/' + name, function (data, status) {
    if(status === 'success') {
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
  $.get('/api/relatedpeople/' + name, function (data, status) {
    if(status === 'success') {
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
  var id = 'paperdetail_' + data.id;
  var title = data.title;
  if(data.title_zh) {
    title += ' (' + data.title_zh + ')';
  }
  dom.append('<div class="title">' + title + '</div>')
};

/*
data format:
  name, (name_zh), image, org, (org_zh), tags, h_index, n_pubs, n_citation, id,
  detail->{similarPersons->{name, image}, contact->{position, phone, email, fax, affiliation, address, interest, edu, work, bio, homepage, avatar}}
*/

var renderPerson = function(dom, data) {
  var id = 'persondetail_' + data.id;
  var contactList = '<ul class="vcard">';
  if(data.detail.contact) {
    var hasContent = false;
    //TODO: filter contents, move bio outside, add captions
    for(var i in data.detail.contact) {
      if(data.detail.contact[i]) {
        contactList += '<li class="' + i + '">' + data.detail.contact[i] + '</li>';
        hasContent = true;
      }
    }
    if(!hasContent) {
      contactList += '<li>No contact info</li>';
    }
  } else {
    contactList += '<li>No contact info</li>';
  }
  contactList += '</ul>';
  var similarPersonList = '<ul class="small-block-grid-6">';
  if(data.detail.similarPersons) {
    var hasSimilar = false;
    for(var i in data.detail.similarPersons) {
      var person = data.detail.similarPersons[i];
      similarPersonList += '<li class="personthumbnail">'
        + '<div><img class="th" src="' + (person.image || 'static/img/default.jpg') + '" alt="' + person.name + '"></div>'
        + '<div>' + person.name + '</div>'
        + '</li>';
      hasSimilar = true;
    }
  }
  //TODO: if !hasContent then ?
  similarPersonList += '</ul>';
  var summary = $('<div class="summary row" />'),
      detail = $('<ul class="detail accordion" data-accordion>'
                 + '<li class="accordion-navigation">'
                 + '<a href="#' + id + '">click for more details</a>'
                 + '<div id="' + id + '" class="content panel">' 
                 + '<div class="contact">'
                 + '<div>contact:</div>'
                 + contactList
                 + '</div>'
                 + '<div class="similarPersons">'
                 + '<div>similar persons:</div>'
                 + similarPersonList
                 + '</div></li></ul>');
  //TODO: change 'loading...' to detail content
  summary.append('<div class="photo small-2 columns">'
                 + '<img class="th" src="' + (data.image || 'static/img/default.jpg') + '">'
                 + '</div>');
  var info = $('<div class="small-10 columns" />');
  var name = data.name;
  if(data.name_zh) {
    name += ' (' + data.name_zh + ')';
  }
  info.append('<div class="name">' + name + '</div>')
  var org = data.org;
  if(data.org_zh) {
    org += ' (' + data.org_zh + ')';
  }
  info.append('<div class="org">' + org + '</div>')
  //  if(data.contact.position) {
  //    info.append('<div class="position">' + data.contact.position + '</div>');
  //  }
  var pubinfo = $('<div class="pubinfo" />');
  pubinfo.append('<span class="hindex label">h_index : ' + data.h_index + '</span>');
  pubinfo.append('<span class="npubs label">n_pubs : ' + data.n_pubs + '</span>');
  pubinfo.append('<span class="ncitation label">n_citation : ' + data.n_citation + '</span>');
  info.append(pubinfo);
  var tags = $('<div class="tags" />');
  for(var i in data.tags) {
    tags.append('<span class="tag label">' + data.tags[i] +'</span>');
  }
  info.append(tags);
  summary.append(info);
  dom.append(summary);
  dom.append(detail);
  $(document).foundation();
};

/*
var renderEntity = function(item, data) {
  console.log('do not need to implement');
};
*/

//type: pubs/people/entity
var renderLayout = function(dom, type, data) {
  console.log('renderlayout:\ntype: ' + type + '\nsize: ' + data.length);
  var id = 'relate_' + type;
  var main = dom.children('#' + id);
  if(main.length === 0) {
    console.log('new panel');
    main = $('<div id="' + id+ '" />');
    dom.prepend(main);
    console.log('new main')
  } else {
    console.log('refreshing');
    main.empty();
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
