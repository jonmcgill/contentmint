//
//  src/js/collectData.js
//
function getComponentData(elem) {
    var $elem = $(elem);
    var data = JSON.parse($elem.attr('data-config'));
    var contextAreas = $elem.find('.Context')
        .toArray()
        .filter(function(context) {
            return $(context).closest('.Component')[0] === elem;
        })
    contextAreas.forEach(function(context) {
        var contextName = $(context).attr('data-context-name');
        $(context).children().each(function() {
            data[contextName].push(getComponentData(this));
        })
    })
    return data;
}

function getStageData() {
    return $('#Stage')
        .children()
        .toArray()
        .map(getComponentData);
}