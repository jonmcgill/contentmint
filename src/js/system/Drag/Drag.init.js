Cmint.Drag.init = function() {

    Cmint.Drag.stage = $(Cmint.Settings.id.stage)[0];
    Cmint.Drag.components = $(Cmint.Settings.id.components)[0];

    Cmint.Drag.dragIndex = null;
    Cmint.Drag.dragData = null;
    Cmint.Drag.dragPosition = null;
    Cmint.Drag.dragFromComponents = null;
    Cmint.Drag.dragVmContextData = null;

    Cmint.Drag.dropInsertType = null;
    Cmint.Drag.dropIndex = null;
    Cmint.Drag.dropInContext = null;
    Cmint.Drag.dropReordered = null;
    Cmint.Drag.dropVmContextData = null;

    Cmint.Drag.config = {

        copy: function(element, source) {
            return source === Cmint.Drag.components;
        },

        accepts: function(element, target, source, sibling) {
            return target !== Cmint.Drag.components && !Cmint.Util.contains(element, target);
        },

        removeOnSpill: true

    }

    Cmint.Drag.drake = dragula([ Cmint.Drag.stage, Cmint.Drag.components ], Cmint.Drag.config);

    Cmint.Drag.drake.on('drag', function(element, source) {
        Cmint.Drag.onDrag(element, source);
    });

    Cmint.Drag.drake.on('drop', function(element, target, source, sibling) {
        Cmint.Drag.onDrop(element, target, source, sibling);
    });

    Cmint.Drag.drake.on('remove', function(element, container, source) {
        Cmint.Drag.onRemove(element, container, source);
    })

}