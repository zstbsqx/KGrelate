/*
 * Relate info manager
 * Load jQuery before load this lib
*/

var infoManager = function (id) {
  var dom = $('#'+id);
  var show = {
    pub: true, 
    people: true,
    entity: false
  };
}

function initLayout(dom, type) {
  if(!this.show[type]) {
    alert(type + ' disabled');
    return false;
  }
  $.get('/' + type + '/' + name, function (data, status) {
    if(status !== 'success') {
      alert('load ' + type + ' failed, status:  ' + status);
      return false;
    }
    var id = '#relate_' + type;
    var main = this.dom.children(id);
    if(!main) {
      main = $('<div id="' + id+ '" />');
      dom.prepend(main);
    }
    main.append('<div>Relate ' + type + ':</div>');
    main.append('<ul class="no-bullet accordion">');
    var publist = pub.children('ul');
    for(var i in data) {
      publist.append('<li />')
    }
  });
}

// $.get status: ("success", "notmodified", "nocontent", "error", "timeout", "abort", or "parsererror")
infoManager.prototype.loadPubs = function (name, options) { //Arg options are for further dev
  
}

infoManager.prototype.loadPeople = function (name, options) { //Arg options are for further dev
  $.get('/people/' + name, function (data, status) {
    if(!this.people) {
      alert('people disabled');
      return false;
    }
    $.get('/people/' + name, function (data, status) {
      if(status !== 'success') {
        alert('load people failed, status:  ' + status);
        return false;
      }
      people = .children('#relate_people');
      if(!people) {
        people = $('<div id="relate_people" />');
        dom.append(people);
      }
      people.append('<div>Relate people:</div>');
      pub.
    });
  });
}

infoManager.prototype.loadEntity = function (name, options) { //Arg options are for further dev
  $.get('/entity/' + name, function (data, status) {
    //do nothing
  });
}
