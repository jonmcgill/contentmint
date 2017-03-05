Cmint.AppFn.createCustomComponent = function(customModal) {

    var double = false;
    if (!Cmint.App.customComponents) {
        Cmint.App.customComponents = [];
    }
    if (customModal.name === '') {
        customModal.nameError = 'Name field is blank';
        return;
    }
    Cmint.App.components.forEach(function(component) {
        if (component.display === component.name) {
            double = true;
        }
    })
    if (!double) {
        var comp = Cmint.Util.copyObject(customModal.component);
        comp.display = customModal.name;
        comp.category = customModal.category || 'Custom';
        Cmint.App.components.push(comp);
        Cmint.App.customComponents.push(comp);
        Cmint.App.save();
        if (comp.category === Cmint.App.selectedCategory) {
            Cmint.Bus.$emit('updateComponentList', comp);
        }
        Cmint.Util.debug('added "' + customModal.name + '" ('+customModal.category+') in template "'+Cmint.App.templateName+'"');
        Cmint.Bus.$emit('closeNewComp');
    } else {
        customModal.nameError = 'Name already exists';
        customModal.name = '';
    }

}