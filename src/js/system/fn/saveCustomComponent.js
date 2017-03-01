Cmint.saveCustomComponent = function(name, category, data) {
    
    var D = Cmint.app.Data;

    if (!D.customComponents[D.template]) {
        D.customComponents[D.template] = [];
    }

    if (D.customComponents[D.template].indexOf(name) < 0) {
        var comp = Util.copy(data);
        comp._display = name;
        comp._category = category || 'Custom';
        Cmint.app.components.push(comp);
        Util.debug('added custom component: ' + name + ' ('+category+') for template "'+D.template+'"');
    } 

}