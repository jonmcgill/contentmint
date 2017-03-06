Vue.component('overlay', {
    template: '<div id="Overlay"></div>',
    data: function() {return{
        isActive: false,
        isVisible: false
    }},
    mounted: function() {
        var _this = this;
        var $el = $(this.$el);
        this.$bus.$on('callComponentFields', function() {
            $el.addClass('active');
            setTimeout(function() {
                $el.addClass('visible');
            }, 20);
        })
        this.$bus.$on('closeFieldWidget', function() {
            $el.removeClass('visible');
            setTimeout(function() {
                $el.removeClass('active');
            }, 200);
        })
    }
})