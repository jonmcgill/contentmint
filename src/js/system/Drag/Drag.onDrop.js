Cmint.Drag.onDrop = function(element, target, source, sibling) {

    var $element = $(element),
        $target = $(target),
        $source = $(source),
        dragVm,
        dropVm,
        dragIndex,
        dropIndex;

    Cmint.Drag.dropInContext = $target.closest(Cmint.Settings.class.context).length > 0;
    Cmint.Drag.dropReordered = $source.closest(Cmint.Settings.id.stage).length > 0;

    if (Cmint.Drag.dragFromComponents && Cmint.Drag.dropInContext) {

        Cmint.Drag.dropIndex = Cmint.Sync.getStagePosition(element);
        $element.remove();
        Cmint.Sync.insertVmContextData(Cmint.Drag.dropIndex, Cmint.Drag.dragData, Cmint.App.stage);
        Vue.nextTick(Cmint.App.refresh);
        Vue.nextTick(Cmint.Drag.fn.updateContainers);
        Vue.nextTick(Cmint.App.snapshot);
        Cmint.Util.debug('dropped new component "'+Cmint.Drag.dragData.name+'" in stage at [' + Cmint.Drag.dropIndex + ']');
        Cmint.App.save();
    }

    if (Cmint.Drag.dropReordered) {

        Cmint.Drag.fn.insertPlaceholder();
        Cmint.Drag.dropIndex = Cmint.Sync.getStagePosition(element);
        Cmint.Util.debug('dropped reordered component at [' + Cmint.Drag.dropIndex + ']');
        Cmint.Drag.fn.replacePlaceholder(element);
        Cmint.Util.debug('replaced placeholder with dropped element');
        Cmint.Drag.dropVmContextData = Cmint.Sync.getVmContextData(Cmint.Drag.dropIndex, Cmint.App.stage);

        dragVm = Cmint.Drag.dragVmContextData;
        dropVm = Cmint.Drag.dropVmContextData;

        // if the drop spot is the same context as the drag spot
        // we need to make sure we account for the placeholder in our index.
        // If the element is being dragged down, we need to subtract one from the
        // drop index on account of the placeholder.
        if (dropVm.context == dragVm.context) {
            dragIndex = dragVm.index;
            dropIndex = dropVm.index;
            if (dragIndex < dropIndex) dropVm.index = dropVm.index - 1;
            Cmint.Util.debug('reordered components in the same context');
        }

        Cmint.Sync.rearrangeVmContextData(dragVm, dropVm);
        Vue.nextTick(Cmint.App.refresh);
        Vue.nextTick(Cmint.Drag.updateContainers);
        Vue.nextTick(Cmint.App.snapshot);
        Cmint.App.save();
        // Util.debug('refreshing and updating containers')

    }

}