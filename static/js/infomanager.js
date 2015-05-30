/*
 * Relate info manager
 * Load jQuery before load this lib
*/

var infoManager = function (id) {
  var dom = $('#'+id);
  var show = {
    pub: false, 
    people: false,
    entity: false
  };
}

infoManager.prototype.loadPubs = function (name, options) { //Arg options are for further dev
  $.get('/pub/' + name, showPubs);
}

infoManager.prototype.loadPeople = function (name, options) { //Arg options are for further dev
  $.get('/people/' + name, showPeople);
}

infoManager.prototype.loadEntity = function (name, options) { //Arg options are for further dev
  $.get('/entity/' + name, showEntity);
}

infoManager.prototype.showPubs