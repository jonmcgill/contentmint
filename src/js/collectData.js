//
//  src/js/collectData.js
//
//  Walks the stage DOM elements and assembles json
//  from the data-config elements and their children.
function collectData(elem, data) {
    var data = data || [];
    var elem = elem || g.node.stage;
    var children = $(elem).children();
    if (children.length) {
        children.each(function() {
            var child = this;
            var comp = JSON.parse($(child).attr(g.name.config));
            var contexts = $(child)
                .find(g.attr.contextName)
                .toArray()
                .filter(function(l) {
                    return $(l).closest(g.class.component)[0] === child;
                })
            if (contexts.length) {
                contexts.forEach(function(context) {
                    comp[$(context).attr(g.name.contextName)] = collectData(context);
                })
            }
            data.push(comp);
        })
    }
    return data;
}