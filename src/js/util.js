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