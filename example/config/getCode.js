// Default toolbar buttons are save, context, and undo. You'll most likely want to 
// write some kind of ajax request that does something with the data and/or markup
// from your created content. This is a way to add a toolbar button for that thing.
Cmint.createToolbarButton({
    text: 'Get Code',
    btnClasses: { 'toolbar-code':true, 'toolbar-btn-fancy': true },
    iconClasses: { 'fa': true, 'fa-code': true },
    callback: function() {

        Cmint.Bus.$emit('closeToolbar');

        if ($('#CodeModal').length === 0) {

            var $modal = $('\
                <div id="CodeModal">\
                    <i class="fa fa-close"></i>\
                    <div class="code-full">\
                        <p>Full Code</p>\
                        <textarea class="code-full-area" spellcheck="false"></textarea>\
                    </div>\
                    <div class="code-content">\
                        <p>Stage Code</p>\
                        <textarea class="code-content-area" spellcheck="false"></textarea>\
                    </div>\
                    <span>CTRL + C to copy</span>\
                </div>')

            Cmint.Bus.$emit('toggleOverlay', true)
            $('body').append($modal);
            $('#CodeModal .code-full-area').text(Cmint.getFullMarkup())
            $('#CodeModal .code-content-area').text(Cmint.App.markup)
            $('#CodeModal i').click(function() {
                Cmint.Bus.$emit('toggleOverlay', false)
                $('#CodeModal').remove();
                Cmint.Bus.$emit('closeToolbar');
                Cmint.Bus.$emit('openSidebar');
                Cmint.Bus.$emit('moveTemplateLeft');
            })
            $('#CodeModal textarea').click(function() {
                $(this).select();
            })

        } else {
            Cmint.Bus.$emit('toggleOverlay', false)
            $('#CodeModal').remove();
            mint.Bus.$emit('closeToolbar');
        }
        
    }
})