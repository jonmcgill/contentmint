// Editor post processes are to the editor instance markup what component hooks are
// to components. Whenever a change occurs in a tinymce editing instance, a postprocess
// hook is run. Tinymce allows you to hook into that process and this is simply a
// wrapper around that feature injecting it into our tinymce implementation.
Cmint.createEditorPostProcess(function(e) {
    $(e.target.bodyElement).find('a').each(function() {
        var attrs = this.attributes;
        if (!attrs.style) {
            this.setAttribute('style', 'color:#0b4b87;');
        } else {
            this.attributes.style = this.attributes.style + 'color:#0b4b87';
        }
        this.setAttribute('target', '_blank');
    })
})


Cmint.createEditorPostProcess(function(e) {
    $(e.target.bodyElement).find('p').each(function() {
        var markup = $(this).html();
        var div = $('<div></div>').append(markup);
        $(this).replaceWith(div);
    })
})