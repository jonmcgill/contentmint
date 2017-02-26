var Drag = (function() {
    
    var drake;

    function init() {

        Drag.stage = $('#Stage')[0];
        Drag.components = $('#Components')[0];
        Drag.draggedIndex = null;
        Drag.draggedData = null;
        Drag.dragSpot = null;
        Drag.insertType = null;

        drake = dragula([Drag.stage, Drag.components], {
            copy: function(theCopy, source) {
                return source === Drag.components;
            },
            accepts: function(element, target, source, sibling) {
                return target !== Drag.components && !Util.contains(element, target);
            },
            removeOnSpill: true
        }).on('drag', Drag.onDrag)
          .on('drop', Drag.onDrop)
          .on('remove', Drag.onRemove);

    }

    function updateContainers() {
        $('#Stage .Context').each(function() {
            if (drake.containers.indexOf(this) <= -1) {
                drake.containers.push(this);
                Util.debug('added new container to drake instance');
            }
        })
    }

    function insertPlaceholder() {
        var placeholder = '<div class="PLACEHOLDER"><strong></strong></div>';
        if (Drag.insertType === 'prepend') {
            $(Drag.dragSpot).prepend(placeholder);
        } else if (Drag.insertType === 'after') {
            $(placeholder).insertAfter(Drag.dragSpot);
        }
    }

    return {
        drake: drake,
        init: init,
        insertPlaceholder: insertPlaceholder,
        updateContainers: updateContainers
    }

})()