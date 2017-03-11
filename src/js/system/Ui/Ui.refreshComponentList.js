Cmint.Ui.refreshComponentList = function() {

    $(Cmint.Settings.id.components).css({opacity: 0})
    setTimeout(function() {
        $('.thumbnail-scale-wrap').each(function() {
            $(this).parent().attr('style', null);
            var h = $(this).parent().height()
            h = h + 34 - 36;
            h = h / 2;
            $(this).parent().height(h)
        })
        $(Cmint.Settings.id.components).animate({opacity: 1}, 400);
    }, 600);

}
