Cmint.AppFn.getTemplateComponents = function(name) {

    var components = [];

    Cmint.Instance.Templates[name].components.forEach(function(comp) {

        var compData = Cmint.Util.copyObject(Cmint.Instance.Components[comp]);

        components.push(compData);

    })

    return components;

}