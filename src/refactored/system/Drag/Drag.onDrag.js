Cmint.Drag.onDrag = function(element, source) {

    Cmint.Bus.$emit('closeActionBar');

    if (source === Cmint.Drag.components) {

        // Get the DOM position of the dragged element and then, using that index
        // get the corresponding piece of data in componentList (i.e. filtered component list)
        Cmint.Drag.dragFromComponents = true;
        Cmint.Drag.dragIndex = Cmint.Sync.getStagePosition(element);
        Cmint.Drag.dragData = Cmint.Sync.getComponentData(Cmint.Drag.dragIndex, Cmint.Ui.componentList);
        Cmint.Util.debug('dragging from component list at [' + Cmint.Drag.dragIndex + ']');

    }

    if ($(source).closest(Cmint.Settings.id.stage).length) {

        Cmint.Drag.dragFromComponents = false;
        Cmint.Drag.dragIndex = Cmint.Sync.getStagePosition(element);
        console.log(Cmint.Drag.dragIndex);
        Cmint.Drag.dragData = Cmint.Sync.getComponentData(Cmint.Drag.dragIndex, Cmint.App.stage);

        Cmint.Drag.dragVmContextData = Cmint.Sync.getVmContextData(Cmint.Drag.dragIndex, Cmint.App.stage);

        if ($(element).prev().length === 0) {
            Cmint.Drag.dragInsertType = 'prepend';
            Cmint.Drag.dragPosition = $(element).parent();
        } else {
            Cmint.Drag.dragInsertType = 'after';
            Cmint.Drag.dragPosition = $(element).prev();
        }

        Cmint.Util.debug('dragging from stage at [' + Cmint.Drag.dragIndex + ']');
        Cmint.Util.debug('drag insert type is "'+Cmint.Drag.dragInsertType+'"');

    }

}