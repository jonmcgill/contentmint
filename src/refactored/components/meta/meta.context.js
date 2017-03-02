// Meta component for contextual regions that nest <comp> instances
Vue.component('context', {

    props: ['tag', 'containers'],

    render: function(make) {
        var classes = {};
        var tag = this.tag || 'div';
        classes[Cmint.G.name.context] = true;
        return make(
            tag, { 'class': classes },
            this.containers.map(function(component) {
                return make(
                    component.name, { props: { 'config': component }}
                )
            })
        )
    }

})