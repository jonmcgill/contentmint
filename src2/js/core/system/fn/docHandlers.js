Cmint.fireDocHandlers = function() {
    $(document).on({

        'click': function(e) {
            var $target = $(e.target);
            var isComponent = $target.closest('.Component').length;
            var isInStage = $target.closest('#Stage').length;
            var isActionBar = $target.closest('#ActionBar').length;

            if (isComponent && isInStage) {
                var component = $target.closest('.Component');
                if (!component.hasClass('active')) {
                    $('.Component.active').removeClass('active');
                    component.addClass('active');
                }
            } else {
                $('.Component.active').removeClass('active');
                if (!isActionBar) {
                    Bus.$emit('closeActionBar');
                }
            }
        }

    })
}