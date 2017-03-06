Cmint.AppFn.save = function() {
    
    Cmint.Bus.$emit('updateEditorData');

    this.saved = Cmint.Util.copyObject(this.stage);

    Cmint.Hooks.onSaveHook({
        template: Cmint.App.template,
        contentNae: Cmint.App.contentName,
        username: Cmint.App.username,
        saved: Cmint.App.saved,
        customComponents: Cmint.App.customComponents
    })

    Cmint.AppFn.notify('saved');

    Cmint.Util.debug('content saved');

}