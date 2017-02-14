//
//  src/js/util.js
//
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


function genID(num) {
    var id = 'ID-', i = 1;
    while (i <= num) {
        if (i % 2 === 0) {
            id += String.fromCharCode(random(65, 90));
        } else {
            id += String.fromCharCode(random(48, 57));
        }
        i++;
    }
    return id;
}


function debug(output) {
    if (g.debug) {
        if (typeof(output) === 'string') {
            console.log('DEBUG: ' + output);
        } else if (typeof(output) === 'object') {
            console.log(output);
        } else if (typeof(output) === 'function') {
            output();
        }
    }
}


function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}


function getIndex(area, item) {
    var index;
    $(area).children().each(function(i) {
        if (this === item) {
            index = i;
            return false;
        }
    })
    return index;
}


function contains(a, b){
  return a.contains ?
    a != b && a.contains(b) :
    !!(a.compareDocumentPosition(b) & 16);
}


function log(thing) {
    console.log(thing);
}



function setComponentJSON(elem, value, result) {
    var $comp = $(elem).closest('.Component');
    data = JSON.parse($comp.attr(g.name.config));
    data.settings[result] = value;
    $comp.attr(g.name.config, JSON.stringify(data));
}


function updateComponentData(elem) {
    var path = walk.up(elem);
    var data = getComponentJSON(elem);
    walk.down(path.reverse(), getComponentJSON(elem), 1);
}

function getComponentJSON(elem) {
    return JSON.parse($(getParentDOMComponent(elem)).attr('data-config'));
}

function dataToDOMJSON(data, elem) {
    $(elem).attr(g.name.config, JSON.stringify(data));
}

function getParentDOMComponent(elem) {
    var found = $(elem).closest(g.class.component);
    if (found.length) {
        return found[0];
    }
}

function setSettingsProperty(elem, prop, value) {
    var $comp = $(elem).closest('.Component');
    var data = JSON.parse($comp.attr(g.name.config));
    data.settings[prop] = value;
    $comp.attr(g.name.config, JSON.stringify(data));
}

function setComponentProperty(elem, prop, value) {
    var $comp = $(elem).closest('.Component');
    var data = JSON.parse($comp.attr(g.name.config));
    data[prop] = value;
    $comp.attr(g.name.config, JSON.stringify(data));
}

function getComponentProperty(elem, prop) {
    var $comp = $(elem).closest('.Component');
    return JSON.parse($comp.attr(g.name.config))[prop];
}

function transferContainer(container) {
    var attributes = $(container)[0].attributes;
    for (var i = 0; i < attributes.length; i++) {
        $(container).parent().attr(attributes[i].name, $(container).attr(attributes[i].name))
    }
    $(container).parent().removeAttr('data-transfer');
    $(container).children().unwrap();
}


function hoverIndication(elem) {
    $(elem).on('mouseenter', function(e) {
        var t = $(e.target);
        if (t.hasClass('Component') || t.hasClass('Context')) {
            t.addClass(g.name.hovered);
            var parent = t.parents('.hovered');
            if (parent[0] && parent[0] !== e.target) {
                parent.addClass('hovered-nested');
            }
        }
    }).on('mouseleave', function(e) {
        var t = $(e.target);
        if (t.hasClass('hovered-nested')) {
            if (t.parents('.hovered').length === 0) {
                t.removeClass('hovered hovered-nested')
            }
        } else if (t.hasClass('hovered')) {
            if (t.parents('.hovered').length > 0) {
                t.parents('.hovered').first().removeClass('hovered-nested');
            }
            t.removeClass('hovered');
        }
    })
}

function setThumbnailHeight() {
    $('.thumbnail').each(function() {
        var compHeight = $(this).find('.thumbnail-component').height();
        $(this).css({ height: $(this).height() / 2 + 30 });
    })
}
$(window).on('load', function() {
    setThumbnailHeight();
})