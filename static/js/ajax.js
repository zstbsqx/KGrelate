/*
    Ajax for data
*/

var im = new InfoManager('relateinfo');

$(document).ready( function() {

    // submit the query
    $("#queryform button").click(function(e) {
        var query_str = $('#text_search').val();
        im.load(query_str);
        $.get('/search/', {'query' : query_str}, handle_result);
    });

    // testcase 1
    $("#testcase1").click(function(e) {
        $.getJSON('js/testcase/testcase1.json', handle_result);
    });

    // maximum the iframe
    $("#fullscreen").click(function(e) {
        frame = $('#graph_frame');
        frame.remove();
        if (frame.attr('fullscreen') == '0'){
            frame.attr('fullscreen', '1');
            frame.attr('width', '100%');
            frame.attr('height', '100%');
            frame.appendTo('#max_view');
            $('#normal_view').hide();
            $('#max_view').show();
        }
        else
        {
            frame.attr('fullscreen', '0');
            frame.removeAttr('width');
            frame.removeAttr('height');
            frame.appendTo('#origin_pos');
            $('#max_view').hide();
            $('#normal_view').show();
        }
    });
});

function handle_result(data, status) {
    //first clear the search_list
    $('#search_list li').slideUp('slow');
    $('#search_list').empty();

    //add content for each item
    for (var i=0;i<data.length;i++) {
        li = $('<li class="accordion-navigation" style="display:none;margin-bottom:1rem !important"></li>');
        $('<a href="#item_'+data[i].id+'" style="padding:0rem">\
               <paper-material elevation=2 style="padding:1rem">\
               <paper-ripple>\
                   <div id="background" class="style-scope paper-ripple" style="opacity: 0.00356479999609291;">\
                   </div>\
                   <div id="waves" class="style-scope paper-ripple">\
                   </div>\
               </paper-ripple>'
               + data[i].title +
              '</paper-material>\
           </a>').appendTo(li);
        $('<div id="item_' + data[i].id + '" class="content" style="padding:0rem">\
               <paper-material elevation=2 style="padding:1rem">'
               +data[i].desc+
              '</paper-material>\
           </div>').appendTo(li);       
       // $('<a href="#item_' + data[i].id + '" class="button split">' + data[i].title + '<span data-dropdown="drop"></span></a>').appendTo(li);
       // $('<div id="item_' + data[i].id + '" class="content">'+ data[i].desc +'</div>').appendTo(li);

        li.appendTo('#search_list')
    }

    //show all content item
    $('#search_list li').slideDown('slow');
}

function search_query() {
    query_str = $('#queryform');
}

function getQuestion() {
    var num = $('#num').val()
    $.post('/question/', {'num' : num}, 
        function(data, status){
            $('#quest')[0].innerHTML = data.question
        })
}