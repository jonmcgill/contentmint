Editor.hooks['vertical-space'] = {
    
    editor: function(elements) {
        elements.each(function() {
            $(this).css({
                'margin-bottom': '24px'
            })
        });
    }

}