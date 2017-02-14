//
//  src/js/component-context.js
//
//  context components do not have editable content. Rather, they
//  are additional wrappers around components that offer different
//  layout possibilities. Each context instance dynamically generates
//  wrapped components given the set of component data given
//  
//  Additionally, when mounted, the context component is added to the
//  dragula instance so it can receive other components
Vue.component('context', {
    props: ['components', 'config'],
    // template: '\
    //     <div class="Context">\
    //         <wrapper v-for="config in components" :config="config"></wrapper>\
    //     </div>',
    render: function(make) {
        var tag = this.config.contextTag ? this.config.contextTag : 'div';
        return make(tag, {'class':{Context: true}}, this.components.map(function(config) {
            return make('wrapper', {
                props: {
                    'config': config
                }
            })
        }))
    },
    mounted: function() {
        addContainer(this.$el);
    }
})