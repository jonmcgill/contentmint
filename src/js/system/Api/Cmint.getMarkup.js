Cmint.getMarkup = function() {

    var markup = Cmint.App.stage.map(function(comp) {
        return comp.markup;
    }).join('\n');

    return markup;

}