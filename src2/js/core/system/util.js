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

    return {
        contains: contains,
        debug: debug,
        jstr: jstr,
        jprs: jprs,
        copy: copy,
        stringToNumber: stringToNumber
    }

})()