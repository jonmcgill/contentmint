// The <comp> component is the meta component wrapper for all user defined
// components.
Vue.component('comp', {

    props: ['config'],

    render: function(make) {
        var classes = {};
        var tag = this.config.tags && this.config.tags.root
            ? this.config.tags.root
            : 'div';
        classes[Cmint.G.name.component] = true;

        return make(
            tag, { 'class': classes },
            this.$slots.default
        )
    },

    mounted: function() {
        Cmint.Util.debug('mounted <comp> "' + this.config.name + '"');
    }
})