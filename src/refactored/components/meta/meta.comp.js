
// components.
Vue.component('comp', {

    props: ['config'],

    render: function(make) {
        var classes = {};
        var tag = this.config.tags && this.config.tags.root
            ? this.config.tags.root
            : 'div';
        classes[Cmint.Settings.name.component] = true;

        return make(
            tag, { 'class': classes },
            this.$slots.default
        )
    },

    data: function(){return{
        environment: null
    }},

    mounted: function() {
        $el = $(this.$el);
        this.environment = $el.closest(Cmint.Settings.id.components).length
            ? 'components'
            : 'stage';
        Cmint.Editor.init(this);
        Cmint.Util.debug('mounted <comp> "' + this.config.name + '"');
    }
})