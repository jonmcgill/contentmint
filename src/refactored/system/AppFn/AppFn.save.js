Cmint.AppFn.save = function() {
    
    Cmint.Bus.$emit('updateEditorData');

    this.saved = Cmint.Util.copyObject(this.stage);
    var $notify = $(Cmint.Settings.class.notification);
    $notify.addClass('active');
    setTimeout(function() {
        $notify.removeClass('active');
    }, 2500);

    Cmint.Util.debug('content saved');

}