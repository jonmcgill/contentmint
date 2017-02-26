Editor.config = {
    inline: true,
    menubar: false,
    insert_toolbar: false,
    fixed_toolbar_container: '#EditorToolbar',
    plugins: 'link lists paste textpattern autolink charmap',
    toolbar: 'undo redo bold italic alignleft aligncenter link bullist numlist superscript charmap'
}

Editor.init = function(component) {

    if (!component.config._content) return;

    $(component.$el).find('[data-edit]').each(function() {

        var config = Util.copy(Editor.config);
        var id = Util.genId(10);
        var contentProp = $(this).attr('data-edit');

        $(this).html(component.config._content[contentProp]);
        
        if (component.environment === 'components') return false;

        $(this).attr('data-editor-id', id);
        config.selector = '[data-editor-id="'+id+'"]';
        
        config.setup = function(editor) {
            editor.on('Change keyup', _.debounce(function() {
                if (component) {
                    component.config._content[contentProp] = editor.getContent();
                    Bus.$emit('fieldProcessing');
                    Util.debug('updated content "'+contentProp+'" for ' + component.config._name);
                }
            }));
            editor.on('blur', function() {
                Cmint.app.snapshot();
            })
        }

        tinymce.init(config);
        $(this).removeAttr('data-editor-id');

    })



}