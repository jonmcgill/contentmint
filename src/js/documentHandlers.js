//
//  src/js/documentHandlers.js
//
function fireDocumentHandlers() {

    $(document).on({
        'click': function(e) {
            var comp = $(e.target).closest('.Component');
            var stage = $(e.target).closest('#Stage');
            if (comp.length > 0 && stage.length > 0) {
                $('.Component.active').removeClass('active');
                comp.addClass('active');
                debug('active comp');
            } else {
                $('.Component.active').removeClass('active');
            }
        }
    })

}