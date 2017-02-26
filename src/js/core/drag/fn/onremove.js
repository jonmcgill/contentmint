Drag.onRemove = function(element, container, source) {

    if ($(source).closest('#Stage').length) {

        Drag.insertPlaceholder();
        $('.PLACEHOLDER').replaceWith(element);
        $(element).removeClass('gu-hide');
        console.log(Cmint.app);
        var removeMe = Index.retrieveVueContext(Drag.draggedIndex, Cmint.app);
        Util.debug('removed component from stage at ' + removeMe.context[removeMe.key]._index);
        removeMe.context.splice(removeMe.key, 1);
        Vue.nextTick(Cmint.app.refresh);
        Vue.nextTick(Cmint.app.snapshot);
    }

}