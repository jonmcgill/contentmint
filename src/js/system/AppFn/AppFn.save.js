Cmint.AppFn.save = function() {
    
    var _this = this;

    setTimeout(function() {
        Cmint.Bus.$emit('updateEditorData');

        _this.saved = Cmint.Util.copyObject(_this.stage);
        _this.markup = Cmint.getMarkup();

        Cmint.Hooks.onSaveHook({
            template: Cmint.App.template,
            contentName: Cmint.App.contentName,
            username: Cmint.App.username,
            saved: Cmint.App.saved,
            customComponents: Cmint.App.customComponents,
            markup: Cmint.App.markup
        })

        Cmint.AppFn.notify('Saved "'+Cmint.App.contentName+'"');

        Cmint.Util.debug('content saved');
    }, 300);

    

}