Cmint.AppFn.deleteCustomComponent = function(customModal) {

    var activeComp = Cmint.App.activeComponent;
    var oldName = activeComp.config.display;

    activeComp.config.display = activeComp.config.originalDisplay;
    activeComp.config.category = activeComp.config.originalCategory;
    activeComp.config.custom = false;

    Cmint.AppFn.replaceIndexIf(Cmint.App.components, null, function(item) {
        console.log(customModal.name);
        return item.display === customModal.name;
    }, 'remove')

    Cmint.AppFn.replaceIndexIf(Cmint.App.customComponents, null, function(item) {
        return item.display === customModal.name;
    }, 'remove')

    Cmint.Bus.$emit('deleteCustomComponent', oldName);
    Cmint.Bus.$emit('selectCategory', 'All');
    Cmint.App.save();

    Cmint.Util.debug('deleted custom component "' + customModal.name + '" in template "'+Cmint.App.templateName+'"');
    Cmint.AppFn.notify('Custom component "'+customModal.name+'" deleted')
    customModal.closeCustom();

}