//
//  src/js/initStageComponent.js
//
function initStageComponent(instance) {
    
    var element = instance.$el,
        componentData = copy(instance.config);

    var contextNames = $(element)
        .find(g.attr.contextName)
        .toArray()
        .filter(function(elem) {
            return $(elem).closest(g.class.component)[0] === element;
        })
        .map(function(elem) {
            return $(elem).attr(g.name.contextName);
        })

    contextNames.forEach(function(name) {
        componentData[name] = [];
    })

    $(element).attr(g.name.config, JSON.stringify(componentData));

}