Cmint.fireDocHandlers = function() {
    $(document).on({

        'click': function(e) {
            var $target = $(e.target);
            var isComponent = $target.closest('.Component').length;
            var isInStage = $target.closest('#Stage').length;
            var isActionBar = $target.closest('#ActionBar').length;
            var categoryList = $target.closest('.category-container').length;
            var fieldChoice = $target.closest('.field-choice-wrap').length;
            var dropdown = $target.closest('.dropdown').length;

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

            if (!categoryList) { Bus.$emit('closeCategoryList'); }

            if (!fieldChoice) { Bus.$emit('closeFieldChoice'); }

            if (!dropdown) { Bus.$emit('closeDropdown'); }

        }

    })
}