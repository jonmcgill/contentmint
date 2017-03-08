Cmint.AppFn.updateCustomComponent = function(customModal) {
    
    customModal.hasError = false;

    var error = Cmint.AppFn.checkCustomName(customModal),
        cloneComp,
        activeComp = Cmint.App.activeComponent,
        oldName = activeComp.config.display;

    if (error === 'blank') return;

    activeComp.config.oldCustomName = oldName;
    activeComp.config.display = customModal.name;
    activeComp.config.category = customModal.category || 'Custom';
    // activeComp.config.custom = true;

    cloneComp = Cmint.Util.copyObject(activeComp.config);

    Cmint.AppFn.replaceIndexIf(Cmint.App.components, cloneComp, function(item) {
        return item.display === oldName;
    })

    Cmint.AppFn.replaceIndexIf(Cmint.App.customComponents, cloneComp, function(item) {
        return item.display === oldName;
    })

    if (activeComp.config.category === Cmint.App.selectedCategory) {
        Cmint.Bus.$emit('selectCategory', Cmint.App.selectedCategory);
    }

    Cmint.Bus.$emit('updateCustom', cloneComp);

    Cmint.App.save();

    

    Cmint.Util.debug('updated custom component "' + customModal.name + '" in template "'+Cmint.App.templateName+'"');
    Cmint.AppFn.notify('Custom component "'+customModal.name+'" updated')
    customModal.closeCustom();

}