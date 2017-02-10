//
//  src/js/component-wrapper.js
//
//  wrappers contain any given component. They handle the logic of the components.
//  wrappers take raw component data, call the component with the name and then
//  pass that data right on along to the generated component.
//  wrappers will also look for the settings property and delegate that off to
//  the <settings> component.
Vue.component('wrapper', {
    props: ['config'],
    template: '\
        <div class="Component">\
            <component :is="config.name" :config="config"></component>\
            <div class="comp-toolbar">\
                <button class="btn-toolbar" @click="copy"><i class="fa fa-clone"></i></button>\
                <button class="btn-toolbar" @click="trash"><i class="fa fa-trash-o"></i></button>\
                <button class="btn-toolbar" @click="openSettings" v-if="config.settings"><i class="fa fa-cog"></i></button>\
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
            console.log(collectData(this.$el));
            walk.down(path.reverse(), data);
        },

        openSettings: function() {
            var _this = this;
            _this.$children[0].config.settings.active = true;
            Vue.nextTick(function() {
                setTimeout(function() {
                    $('.field-widget').addClass('active');
                    _this.$root.fieldsOpen = true;
                }, 100);
            })
        }

    },
    mounted: function() {
        initStageComponent(this);
        initEditor(this);
        // hoverIndication(this.$el);
        $(this.$el).find('a').click(function(e) {
            debug('prevent link clicks');
            e.preventDefault();
        })
    },
    updated: function() {
        initStageComponent(this);
        $(this.$el).find('a').click(function(e) {
            debug('prevent link clicks');
            e.preventDefault();
        })
    }
})