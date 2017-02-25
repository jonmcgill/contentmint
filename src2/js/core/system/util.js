var Util = (function() {
    
    function contains(a, b){
      return a.contains ?
        a != b && a.contains(b) :
        !!(a.compareDocumentPosition(b) & 16);
    }

    function debug(thing) {
        console.log('DEBUG: ' + thing);
    }

    function jstr(obj) {
        return JSON.stringify(obj);
    }

    function jprs(str) {
        return JSON.parse(str);
    }

    function copy(obj) {
        return jprs(jstr(obj));
    }

    function stringToNumber(string) {
        var convert = string * 1;
        return isNaN(convert) ? string : convert;
    }

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

    return {
        contains: contains,
        debug: debug,
        jstr: jstr,
        jprs: jprs,
        copy: copy,
        stringToNumber: stringToNumber,
        genId: genID
    }

})()