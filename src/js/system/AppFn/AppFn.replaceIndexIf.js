Cmint.AppFn.replaceIndexIf = function(list, data, fn, remove) {

    var index = null;

    list.forEach(function(thing, i) {
        if (fn(thing)) index = i;
    })

    if (index !== null) {
        if (remove === 'remove') {
            list.splice(index, 1);
        } else {
            list.splice(index, 1, data);
        }
    }

}