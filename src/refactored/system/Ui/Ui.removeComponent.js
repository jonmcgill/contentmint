Cmint.Ui.removeComponent = function() {

    var comp = Cmint.App.activeComponent;
    var position = Cmint.Sync.getVmContextData(comp.config.index, Cmint.App.stage);

    position.context.splice(position.index, 1);
    Vue.nextTick(Cmint.Drag.updateContainers);
    Vue.nextTick(Cmint.App.snapshot);

    Cmint.Bus.$emit('closeActionBar');
    Cmint.Util.debug('removed "' + comp.config.name + '" [' + comp.config.index + ']');
    Cmint.App.save();

}