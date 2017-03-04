Cmint.Ui.callCustomModal = function(data) {

    var comp = Cmint.App.activeComponent;
    var position = Cmint.Sync.getVmContextData(comp.config.index, Cmint.App.stage);
    var clone = Cmint.Util.copyObject(position.context[position.index]);
    
    data.focused = clone;
    data.newComp = !data.newComp;

}