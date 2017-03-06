Cmint.Ui.copyComponent = function() {

    var comp = Cmint.App.activeComponent;
    var position = Cmint.Sync.getVmContextData(comp.config.index, Cmint.App.stage);
    var clone = Cmint.Util.copyObject(position.context[position.index])

    position.context.splice(position.index + 1, 0, clone);
    Vue.nextTick(Cmint.Drag.updateContainers);
    Vue.nextTick(Cmint.App.snapshot);

    Cmint.Bus.$emit('closeActionBar');
    Cmint.Util.debug('copied ' + comp.config.name + '[' + comp.config.index + ']');
    Cmint.App.save();

}