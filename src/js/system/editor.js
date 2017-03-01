Editor.config = {
    inline: true,
    menubar: false,
    insert_toolbar: false,
    fixed_toolbar_container: '#EditorToolbar',
    plugins: 'link lists paste textpattern autolink charmap',
    toolbar: 'undo redo bold italic alignleft aligncenter link bullist numlist superscript charmap',
    forced_root_block: 'div',
    force_hex_style_colors: true
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
        
        var STASH;

        config.init_instance_callback = function(editor) {
            STASH = editor.getContent();
            editor.on('PostProcess', function(e) {
                Editor.postProcesses.forEach(function(fn) {
                    fn(e);
                })
            })
        }

        config.setup = function(editor) {
            editor.on('Change keyup', _.debounce(function() {
                if (component) {
                    Editor.runHook(component, 'editor');
                    component.config._content[contentProp] = editor.getContent();
                    Bus.$emit('fieldProcessing');
                    Util.debug('updated content "'+contentProp+'" for ' + component.config._name);
                }
            }));
            editor.on('focus', function() {
                STASH = editor.getContent();
            });
            editor.on('blur', function() {
                if (!component.config._content) return;
                if (component.config._content[contentProp] !== STASH) {
                    Cmint.app.save();
                    Cmint.app.snapshot();
                }
            })
        }

        tinymce.init(config);
        $(this).removeAttr('data-editor-id');

    })

}