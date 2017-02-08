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
    /*
        So, when a new component is created in the staging area, it starts
        as a direct copy of the thumbnail. Previously we just removed that element,
        inserted its data into the Vue instance, and let Vue handle rendering. However,
        since rearranging components in stage cannot interact with data, neither can
        adding components, otherwise lots of confusion.
    */
    if (source === g.node.thumbnails && $(target).hasClass(g.name.context)) {

        var compData = JSON.parse($(el).find(g.class.component).attr(g.name.config));
        var index = getIndex($(el).parent(), el);
        var dataPath = walk.up(el);

        $(el).remove();
        walk.down(dataPath.reverse(), compData);

        Vue.nextTick(function() {
            app.save();
            checkSync();
        })
    }
    if ((source === g.node.Stage || $(source).hasClass(g.name.context)) &&
        (target === g.node.Stage || $(target).hasClass(g.name.context))) {
        syncStageAndStore();
        checkSync();
    }
})

function addContainer(el) {
    if (!$(el).closest('.thumbnail').length && drake) {
        drake.containers.push(el);
    }
}