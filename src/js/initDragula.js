//
//  src/js/initDragula.js
//
var drake = dragula([g.node.thumbnails, g.node.stage], {

    copy: function(el, source) {
        return source === g.node.thumbnails;
    },

    // http://jsfiddle.net/cfenzo/7chaomnz/ (for the contains bit)
    // Was getting child node error from dragula when moving nested containers
    accepts: function(el, target) {
        return target !== g.node.thumbnails && !contains(el, target);
    },

    removeOnSpill: function(el, source) {
        return source === g.node.Stage;
    }


}).on('drop', function(el, target, source, sibling) {
    if (source === g.node.thumbnails && $(target).hasClass(g.name.context)) {
        var compData = JSON.parse($(el).find(g.class.component).attr(g.name.config));
        var index = getIndex($(el).parent(), el);
        var dataPath = walk.up(el);
        debug('Component json data on drop');
        debug(compData);
        debug('Path to spot in data structure parsed from DOM position');
        debug(dataPath);

        $(el).remove();
        walk.down(dataPath.reverse(), compData);

        Vue.nextTick(function() {
            app.collect();
            debug(checkSync);
        })
    }
    if ((source === g.node.Stage || $(source).hasClass(g.name.context)) &&
        (target === g.node.Stage || $(target).hasClass(g.name.context))) {
        syncStageAndStore();
        debug(checkSync);
    }
}).on('remove', function(el, container, source) {
    syncStageAndStore();
    debug(checkSync);
})

function addContainer(el) {
    if (!$(el).closest('.thumbnail').length && drake) {
        drake.containers.push(el);
    }
}