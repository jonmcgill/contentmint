
// components.
Vue.component('comp', {

    props: ['config', 'tag'],

    render: function(make) {
        var classes = {};
        var tag = this.config.tags && this.config.tags.root
            ? this.config.tags.root
            : 'div';
        tag = this.tag ? this.tag : tag;
        classes[Cmint.Settings.name.component] = true;
        classes[Cmint.Settings.name.contextualize] = this.contextualize;

        return make(
            tag, { 'class': classes },
            this.$slots.default
        )
    },

    data: function(){return{
        environment: null
    }},

    computed: {
        contextualize: function() {
            return Cmint.App ? Cmint.App.contextualize : false;
        }
    },

    methods: {

        run: function(action) {
            var _this = this;
            var $el = $(_this.$el);

            // Is the component staged, or in the component sidebar?
            this.environment = $el.closest(Cmint.Settings.id.components).length
                ? 'components'
                : 'stage';

            // Get the component's position in data from its position in DOM
            this.config.index = Cmint.Sync.getStagePosition(this.$el);

            // Assign field uid if component utilizes fields system
            if (this.config.fields) Cmint.Fields.assignUid(this);

            // Adding custom, originalDisplay, originalCategory
            Cmint.AppFn.compSetup(this.config);

            // Watch for updates to the same custom component type and splice accordingly
            // Cmint.AppFn.updateStageCustomComponents(this);
            Cmint.Bus.$on('deleteCustomComponent', function(name) {
                if (_this.config.custom && _this.config.display === name) {
                    _this.config.custom = false;
                    _this.config.display = _this.config.originalDisplay;
                    _this.config.category = _this.config.originalCategory;
                }
            })
            
            // Run component hooks
            Cmint.Hooks.runComponentHooks('editing', this.$el, this.config);

            // Run editor initiation
            Cmint.Editor.init(this);

            // Run actionbar handler
            Cmint.Ui.actionbarHandler(this);

            Cmint.Util.debug(action + ' <comp> "' + this.config.name + '"');
        }

    },

    created: function() {
        Cmint.Fields.setOutputWatch(this);
    },

    mounted: function() {
        this.run('mounted');
    },

    updated: function() {
        this.run('updated');
    }

})