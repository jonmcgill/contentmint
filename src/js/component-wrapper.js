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

    render: function(make) {
        var _this = this;
        var tag = this.config.componentTag
            ? this.config.componentTag
            : 'div';

        var settingsBtn = function() {
            return _this.config.settings
                ? make('button', {
                'class': { 'btn-toolbar': true },
                on: { click: _this.openSettings }},
                [   make('i', {'class': {'fa': true, 'fa-cog': true }} )])
                : null;
        }

        return make(tag, {
            'class': {
                Component: true
            }},
            [
            make(this.config.name, {
                props: { config: this.config },
            }),
        ])
    },

    methods: {

        trash: function() {
            $(this.$el).remove();
            syncStageAndStore();
            debug(checkSync);
        },

        copy: function() {
            var path = walk.up(this.$el);
            path[0].index++;
            var data = getComponentData(this.$el);
            walk.down(path.reverse(), data);
        },

        openSettings: function() {
            var _this = this;
            this.$root.activeComponent = this;
            setSettingsProperty(this.$el, 'active', true);
            updateComponentData(this.$el);
            Vue.nextTick(function() {
                setTimeout(function() {
                    $('.field-widget').addClass('active');
                    _this.$root.fieldsOpen = true;
                }, 100);
            })
        },

        showToolbar: function() {
            var _this = this;
            var _el = this.$el;
            $(_el).click(function(e) {
                if ($(e.target).closest('.Component')[0] === _el) {
                    var offset = $(_el).offset();
                    var top = offset.top + 'px';
                    _this.$root.toolbar = _this;
                    $('#Toolbar').css({
                        top: top
                    }).addClass('active');
                }
            })
        }

    },
    mounted: function() {
        var _this = this;
        initStageComponent(this);
        initEditor(this);
        $(this.$el).find('a').click(function(e) {
            debug('prevent link clicks');
            e.preventDefault();
        })
        $(this.$el).find('[data-transfer]').each(function() {
            transferContainer(this);
        })
        this.showToolbar();
    },
    updated: function() {
        initStageComponent(this);
        initEditor(this);
        $(this.$el).find('a').click(function(e) {
            debug('prevent link clicks');
            e.preventDefault();
        })
        $(this.$el).find('[data-transfer]').each(function() {
            transferContainer(this);
        })
        this.showToolbar();
    }
})
