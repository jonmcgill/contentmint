Cmint.Drag.fn = (function(){

    function updateContainers() {
        $(Cmint.Settings.id.stage + ' ' + Cmint.Settings.class.context).each(function() {
            if (Cmint.Drag.drake.containers.indexOf(this) <= -1) {
                Cmint.Drag.drake.containers.push(this);
                Cmint.Util.debug('added container to drake.containers');
            }
        })
    }

    function insertPlaceholder() {
        var placeholder = '<div class="'+Cmint.Settings.name.placeholder+'" style="display:none;"></div>';
        if (Cmint.Drag.dragInsertType === 'prepend') {
            $(Cmint.Drag.dragPosition).prepend(placeholder);
        } else if (Cmint.Drag.dragInsertType === 'after') {
            $(placeholder).insertAfter(Cmint.Drag.dragPosition);
        }
    }

    function replacePlaceholder(replacement) {
        $(Cmint.Settings.class.placeholder).replaceWith(replacement);
    }

    return {
        updateContainers: updateContainers,
        insertPlaceholder: insertPlaceholder,
        replacePlaceholder: replacePlaceholder
    }

})()