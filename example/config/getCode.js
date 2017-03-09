// Default toolbar buttons are save, context, and undo. You'll most likely want to 
// write some kind of ajax request that does something with the data and/or markup
// from your created content. This is a way to add a toolbar button for that thing.
Cmint.createToolbarButton({
    text: 'Get Code',
    btnClasses: { 'toolbar-code':true, 'toolbar-btn-fancy': true },
    iconClasses: { 'fa': true, 'fa-code': true },
    callback: function() {
        if ($('#CodeModal').length === 0) {
            var $codeModal = $('<div id="CodeModal"></div>');
            $codeModal.css({
                'position': 'fixed',
                'top': '40px',
                'bottom': '0',
                'width': '100%',
                'z-index':'8000'
            })
            $codeModal.append('\
                <textarea style="margin:1em;\
                    width:42em;height:22em;\
                    display:block;padding:2em;\
                    border:1px solid #888;\
                    font-family:Consolas;"></textarea>')
            Cmint.Bus.$emit('toggleOverlay', true)
            $('body').append($codeModal);
            $('#CodeModal textarea').text(Cmint.App.markup)
            $('#CodeModal textarea').focus().select();
        } else {
            Cmint.Bus.$emit('toggleOverlay', false)
            $('#CodeModal').remove();
        }
        
    }
})