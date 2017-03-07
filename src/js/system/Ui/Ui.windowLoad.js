Cmint.Ui.windowLoad = function() {

    $(window).on('load', function() {
        // Adjust height of thumbnail containers
        $('.thumbnail-scale-wrap').each(function() {
            var h = $(this).parent().height();
            h = h + 34 - 36;
            h = h / 2;
            $(this).parent().height(h);
        })
    })

}
