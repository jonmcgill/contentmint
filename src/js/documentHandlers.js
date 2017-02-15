//
//  src/js/documentHandlers.js
//
function fireDocumentHandlers(app) {

    $(document).on({
        'click': function(e) {
            var target = $(e.target);
            var comp = target.closest('.Component');
            var stage = target.closest('#Stage');
            var toolbar = target.closest('#Toolbar');
            
            if (!comp.length && !stage.length && !toolbar.length) {
                app.toolbar.active = false;
            }
        }
    })

}
