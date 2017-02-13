//
//  src/js/walk.js
//
var walk = {
    up: function(el, selector) {
        var path = [];
        function travel(elem) {
            var nextContext = $(elem).closest('.Context')[0];
            var index = getIndex(nextContext, elem);
            var name = $(nextContext).attr('data-context-name');
            path.push({index: index, name: name});
            if ($(nextContext).attr('id') !== 'Stage') {
                travel($(nextContext).closest('.Component')[0])
            }
        }
        travel(el);
        return path;
    },

    down: function(path, obj, remove) {
        var item = app;
        var remove = remove || 0;
        path.forEach(function(data, i) {
            if (i === path.length - 1) {
                item[data.name].splice(data.index, remove, obj);
            } else {
                item = item[data.name][data.index];
            }
        })
        return;
    }
}