Cmint.AppFn.notify = function(message) {
    
    var $notify = $(Cmint.Settings.class.notification);
    
    $notify.text(message);
    $notify.addClass('active');
    setTimeout(function() {
        $notify.removeClass('active');
    }, 2500);

}