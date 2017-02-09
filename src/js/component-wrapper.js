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
            <div class="comp-toolbar">\
                <button class="btn-toolbar" @click="copy"><i class="fa fa-clone"></i></button>\
                <button class="btn-toolbar" @click="trash"><i class="fa fa-trash-o"></i></button>\
                <button class="btn-toolbar"><i class="fa fa-cog"></i></button>\
            </div>\
        </div>',
    methods: {

        trash: function() {
            $(this.$el).remove();
            syncStageAndStore();
            debug(checkSync);
        },

        copy: function() {
            var path = walk.up(this.$el);
            path[0].index++;
            var data = JSON.parse($(this.$el).attr('data-config'));
            walk.down(path.reverse(), data);
        }

    },
    mounted: function() {
        initStageComponent(this);
        initEditor(this.$el);
        hoverIndication(this.$el);
    },
    updated: function() {
        initStageComponent(this);
    }
})