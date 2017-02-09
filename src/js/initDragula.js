//
//  src/js/initDragula.js
//
var drake = dragula([g.node.thumbnails, g.node.stage, g.node.trash], {

    copy: function(el, source) {
        if (app.shiftdown && source === g.node.stage) {
            return true;
        } else {
            return source === g.node.thumbnails;
        } 
    },

    // http://jsfiddle.net/cfenzo/7chaomnz/ (for the contains bit)
    // Was getting child node error from dragula when moving nested containers
    accepts: function(el, target) {
        return target !== g.node.thumbnails && !contains(el, target);
    },

}).on('drop', function(el, target, source, sibling) {

    if (target === g.node.trash) {
        
        syncStageAndStore();
        debug('Component trashed');
        debug(checkSync);
        g.$.trash.empty();

    } else if (source === g.node.thumbnails && $(target).hasClass(g.name.context)) {

        var compData = JSON.parse($(el).find(g.class.component).attr(g.name.config));
        var index = getIndex($(el).parent(), el);
        var dataPath = walk.up(el);

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

}).on('over', function(el, container, source) {

    if (container === g.node.trash) {
        g.$.trash.addClass('trashing');
    } else {
        g.$.trash.removeClass('trashing');
    }

}).on('dragend', function(el, container, source) {

    g.$.trash.removeClass('trashing');

})

function addContainer(el) {
    if (!$(el).closest('.thumbnail').length && drake) {
        drake.containers.push(el);
    }
}