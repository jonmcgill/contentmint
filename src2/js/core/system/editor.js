Editor.config = {
    inline: true,
    menubar: false,
    insert_toolbar: false,
    fixed_toolbar_container: '#EditorToolbar',
    plugins: 'link lists paste textpattern autolink',
    toolbar: 'undo redo bold italic alignleft aligncenter link bullist numlist'
}

Editor.init = function(component) {
    if (component.environment === 'components') return;
    $(component.$el).find('[data-editor]').each(function() {
        var config = Util.copy(Editor.config);
        var id = Util.genId(10);
        $(this).attr('data-editor', id);
        config.selector = '[data-editor="'+id+'"]';
        tinymce.init(config);
        $(this).removeAttr('data-editor');
    })
}