Drag.onDrag = function(element, source) {
    
    Bus.$emit('closeActionBar');

    if (source === Drag.components) {
        Drag.draggedIndex = Index.getDomIndex(element);
        // Reference the componentList rather than app.stage because the user may
        // have filtered the categories
        Drag.draggedData = Util.copy(Index.getVueIndex(Drag.draggedIndex, null, Cmint.componentList));
        Util.debug('dragging from components at ' + Drag.draggedIndex);
    }

    if ($(source).closest('#Stage').length) {
        Drag.draggedIndex = Index.getDomIndex(element);
        if ($(element).prev().length === 0) {
            Drag.dragSpot = $(element).parent();
            Drag.insertType = 'prepend';
        } else {
            Drag.dragSpot = $(element).prev();
            Drag.insertType = 'after'
        }
        Util.debug('dragging from stage at ' + Drag.draggedIndex);
        Util.debug('insert type is "' + Drag.insertType + '"');
    }

}