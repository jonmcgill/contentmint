Cmint.getMarkup = function(context) {

    var region = context || Cmint.App.stage;

    var markup = region.map(function(comp) {
        return comp.markup;
    }).join('\n');

    return markup;

}