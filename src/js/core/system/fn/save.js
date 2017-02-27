Cmint.save = function() {
    Bus.$emit('updateEditorData');
    this.saved = Util.copy(this.stage);
    
    var $notify = $('.notification');
    $notify.addClass('active');
    setTimeout(function() {
        $notify.removeClass('active');
    }, 2500);

    Util.debug('saved content');
}