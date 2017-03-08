Vue.component('overlay', {
    template: '<div id="Overlay"></div>',
    data: function() {return{
        isActive: false,
        isVisible: false
    }},
    mounted: function() {
        var _this = this;
        var $el = $(this.$el);
        Cmint.Bus.$on('toggleOverlay', function(show) {
            if (show) {
                $el.addClass('active');
                setTimeout(function() {
                    $el.addClass('visible');
                }, 20);
            } else {
                $el.removeClass('visible');
                setTimeout(function() {
                    $el.removeClass('active');
                }, 200);
            }
        })
    }
})