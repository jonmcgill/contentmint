Cmint.AppFn.createCustomComponent = function(customModal) {

    var double = false;

    // Create customComponents array
    if (!Cmint.App.customComponents) {
        Cmint.App.customComponents = [];
    }

    // If no name, render error
    if (customModal.name === '') {
        customModal.nameError = 'Name field is blank';
        return;
    }

    // Find any duplicate names
    Cmint.App.components.forEach(function(component) {
        if (component.display === customModal.name) {
            double = true;
        }
    })

    // If no duplicates, add new custom component
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
        Cmint.AppFn.notify('Custom component "'+customModal.name+'" added!')

    // If duplicate name, render error
    } else {
        customModal.nameError = 'Name already exists';
        customModal.name = '';
    }

}