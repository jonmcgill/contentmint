Drag.onDrop = function(dropped, target, source, sibling) {

    var inContext, fromComponents, reordering, domIndex;
            
    toContext = $(target).closest('.Context').length > 0;
    fromComponents = source === Drag.components;
    reordering = $(source).closest('#Stage').length > 0;

    //  Once the component is dropped, we'll need to grab it's index and then
    //  immediately remove it from DOM. We add the copied data to the vm and then
    //  run a refresh.
    if (fromComponents && toContext) {

        domIndex = Index.getDomIndex(dropped);
        $(dropped).remove();
        Index.setVueIndex(domIndex, Drag.draggedData);
        Vue.nextTick(Cmint.app.refresh);
        Vue.nextTick(Drag.updateContainers);
        Vue.nextTick(Cmint.app.snapshot);
        Util.debug('dropped new component in stage at ' + domIndex);

    }

    if (reordering) {

        //  We need the placeholder element to appear where the dragged item came from
        //  so that when we grab the location from the DOM it is an accurate data model.
        //  Once we have the index we can remove it immediately.
        var debugDelay = 0;

        Drag.insertPlaceholder();

        domIndex = Index.getDomIndex(dropped);

        Util.debug('dropped reordered component at ' + domIndex);

        // These timeouts are here so I can debug easier. It's helpful.
        setTimeout(function() {

            $('.PLACEHOLDER').replaceWith(dropped);
            Util.debug('removing placeholder')

            setTimeout(function() {
                //  Now we use the index from the DOM to retrieve the vm context arrays.
                //  Once we have those, we splice the dragged data into the drop context array.
                var dataToDrop = Index.retrieveVueContext(Drag.draggedIndex, Cmint.app);
                var dataDrop = Index.retrieveVueContext(domIndex, Cmint.app);
                if (dataDrop.context == dataToDrop.context) {
                    var drag_i = Drag.draggedIndex[Drag.draggedIndex.length - 1];
                    var drop_i = dataDrop.key;
                    if (drag_i < drop_i) {
                        dataDrop.key--;
                    }
                    Util.debug('reording in the same container');
                }
                dataDrop.context.splice(dataDrop.key, 0, dataToDrop.context.splice(dataToDrop.key, 1)[0]);
                Util.debug('splicing vm data')

                setTimeout(function() {
                    //  At this point, the data and the DOM should technically match, but we want to
                    //  do a refresh() so that all other DOM components are updated with their new
                    //  location. Lastly, we add any new context components to the dragula instance
                    Vue.nextTick(Cmint.app.refresh);
                    Vue.nextTick(Drag.updateContainers);
                    Vue.nextTick(Cmint.app.snapshot);
                    Util.debug('refreshing and updating containers')
                }, debugDelay)
            }, debugDelay)
        }, debugDelay)
    } // ends reordering

}