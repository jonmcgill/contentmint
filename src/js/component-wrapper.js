//
//  src/js/component-wrapper.js
//
//  wrappers contain any given component. They handle the logic of the components.
//  wrappers take raw component data, call the component with the name and then
//  pass that data right on along to the generated component
Vue.component('wrapper', {
    props: ['config'],
    template: '\
        <div class="Component">\
            <component :is="config.name" :config="config"></component>\
        </div>',
    mounted: function() {
        initStageComponent(this);
        initEditor(this.$el);
    },
    updated: function() {
        initStageComponent(this);
    }
})