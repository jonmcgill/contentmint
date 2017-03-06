
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
            $el = $(this.$el);

            // Is the component staged, or in the component sidebar?
            this.environment = $el.closest(Cmint.Settings.id.components).length
                ? 'components'
                : 'stage';

            // Get the component's position in data from its position in DOM
            this.config.index = Cmint.Sync.getStagePosition(this.$el);

            // Assign field uid if component utilizes fields system
            Cmint.Fields.assignUid(this);
            
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