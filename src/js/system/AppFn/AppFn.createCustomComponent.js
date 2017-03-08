Cmint.AppFn.createCustomComponent = function(customModal) {
    
    customModal.hasError = false;

    var error = Cmint.AppFn.checkCustomName(customModal),
        cloneComp,
        activeComp = Cmint.App.activeComponent;

    // Create customComponents array
    if (!Cmint.App.customComponents) {
        Cmint.App.customComponents = [];
    }

    if (error === 'blank') return;

    // If no duplicates, add new custom component
    if (error === 'pass') {

        activeComp.config.display = customModal.name;
        activeComp.config.category = customModal.category || 'Custom';
        activeComp.config.custom = true;

        cloneComp = Cmint.Util.copyObject(activeComp.config);

        Cmint.App.components.push(cloneComp);
        Cmint.App.customComponents.push(cloneComp);
        Cmint.App.save();

        if (activeComp.config.category === Cmint.App.selectedCategory) {
            Cmint.Bus.$emit('updateComponentList', cloneComp);
        }

        Cmint.Util.debug('added "' + customModal.name + '" ('+customModal.category+') in template "'+Cmint.App.templateName+'"');
        Cmint.AppFn.notify('Custom component "'+customModal.name+'" added!')
        customModal.closeCustom();

    // If duplicate name, render error
    } else {
        customModal.nameError = '"'+customModal.name+'" already exists';
        customModal.name = '';
        customModal.hasError = true;
    }

}