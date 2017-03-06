Cmint.Drag.onRemove = function(element, container, source) {
    
    if ($(source).closest(Cmint.Settings.id.stage).length) {

        Cmint.Drag.fn.insertPlaceholder();
        Cmint.Drag.fn.replacePlaceholder(element);
        $(element).removeClass('gu-hide');

        Cmint.Util.debug('removed component "'+Cmint.Drag.dragData.name+'" from stage at ' + Cmint.Drag.dragData.index);
        Cmint.Sync.removeVmContextData(Cmint.Drag.dragVmContextData);

        Vue.nextTick(Cmint.App.refresh);
        Vue.nextTick(Cmint.App.save);
        Vue.nextTick(Cmint.App.snapshot);

    }

}