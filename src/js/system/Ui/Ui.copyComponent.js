Cmint.Ui.copyComponent = function() {

    var comp = Cmint.App.activeComponent;
    var position = Cmint.Sync.getVmContextData(comp.config.index, Cmint.App.stage);
    var clone = Cmint.Util.copyObject(position.context[position.index])

    clone.copy = true;

    position.context.splice(position.index + 1, 0, clone);

    Vue.nextTick(Cmint.Drag.updateContainers);
    Vue.nextTick(Cmint.App.snapshot);

    // If a component with fields is copied it must have it's fields initiated by
    // mounting the fields widget with the component. Otherwise it will not be
    // linked to Fields.UIDS and any updates made to editor content will not trigger
    // field processes.
    if (!!clone.fields) {
        Cmint.App.fieldsMountOnly = true;
        Cmint.App.fieldsComponent = clone;
        setTimeout(function() {
            Cmint.App.fieldsMountOnly = false;
            Cmint.App.fieldsComponent = null;
        },20)
    }
    
    Cmint.Bus.$emit('closeActionBar');
    Cmint.Util.debug('copied ' + comp.config.name + '[' + comp.config.index + ']');
    Cmint.App.save();

}