Cmint.Editor.init = function(component) {

    if (!component.config.content) return;

    var editable = $(component.$el).find(Cmint.Settings.attr.dataEdit);
    if ($(component.$el).attr(Cmint.Settings.name.dataEdit)) {
        editable.push($(component.$el));
    }

    editable.each(function() {

        var config = Cmint.Util.copyObject(Cmint.Editor.config),
            editorUid = Cmint.Util.uid(10),
            $this = $(this),
            contentKey = $this.attr(Cmint.Settings.name.dataEdit),
            stash;

        $this.html(component.config.content[contentKey]);

        if (component.environment === 'components') return false;

        $this.attr('data-temp', editorUid);
        config.selector = '[data-temp="'+editorUid+'"]';

        config.init_instance_callback = function(editor) {
            stash = editor.getContent();
            editor.on('PostProcess', function(e) {
                Cmint.Instance.Editor.PostProcesses.forEach(function(fn) {
                    fn(e);
                })
            })
        }

        config.setup = function(editor) {
            if (component) 
            editor.on('Change keyup', _.debounce(function() {
                if (component) {
                    component.config.content[contentKey] = editor.getContent();
                    Cmint.Util.debug('updated content "'+contentKey+'" for ' + component.config.name);
                }
            },500));
            editor.on('focus', function() {
                Cmint.Bus.$emit('showToolbar');
                component.config.content[contentKey] = editor.getContent();
                stash = editor.getContent();
            });
            editor.on('blur', function() {
                if (!component.config.content) return;
                if (component.config.content[contentKey] !== stash) {
                    Cmint.Bus.$emit('fieldProcessing');
                    Vue.nextTick(Cmint.App.refresh);
                    Vue.nextTick(Cmint.App.snapshot);
                    Cmint.App.save();
                }
            })
            $this.removeAttr('data-temp');
        }

        tinymce.init(config);

    })

}