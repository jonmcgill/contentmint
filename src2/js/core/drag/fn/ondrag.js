Drag.onDrag = function(element, source) {
    
    if (source === Drag.components) {
        Drag.draggedIndex = Index.getDomIndex(element);
        Drag.draggedData = Util.copy(Index.getVueIndex(Drag.draggedIndex));
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