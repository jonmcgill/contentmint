// Not used (for now). I'm leaving it here because there may be a time when I want it
Cmint.Ui.componentDragIconHandler = function(component) {

    var $comp = $(component.$el),
        offset = $comp.offset(),
        width = $comp.width();

    $comp.unbind('mouseenter mouseleave');

    $comp.on('mouseenter', function() {
        $(this).addClass('maybeActive');
    })
    $comp.on('mouseleave', function() {
        $(this).removeClass('maybeActive');
    })

    $(document).on('mousemove', function(event) {

        var left = event.pageX,
            top = event.pageY,
            maybe = $comp.hasClass('maybeActive'),
            draggable = $comp.hasClass('draggable'),

            inZone = left > offset.left + width - 25 &&
                     left < offset.left + width + 5 &&
                     top > offset.top - 5 &&
                     top < offset.top + 25;

        if (inZone && !draggable) {
            $comp.addClass('draggable');
        } else if (!inZone && draggable) {
            $comp.removeClass('draggable');
        }

    })

}