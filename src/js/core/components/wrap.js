Vue.component('wrap', {
    props: ['config'],
    render: function(make) {
        var tag = this.config._tag || 'div';
        return make(tag,
            {
                'class': {
                    'Component': true,
                    'Contextualized': this.contextualize
                }
            },
            [
                make(this.config._name, {props: {'config': this.config}})
            ]
        )
    },
    data: function(){return{
        environment: null,
    }},
    methods: {
        showFields: function() {
            this.$emit('showfields', this.config);
        }
    },
    computed: {
        contextualize: function() {
            return Cmint.app ? Cmint.app.contextualize : false
        }
    },
    created: function() {
        var _this = this;
        Util.debug('created component ' + _this.config._name);
        if (_this.config._tokens) {
            _this.$options.watch = {};
            _this.config._tokens.forEach(function(token) {
                var source = token[Object.keys(token)[0]];
                _this.$watch(
                    function() {
                        if (_this.config._fiels) {
                            return _this.config._fields.output[source]; 
                        }
                    },
                    function(newVal, oldVal) {
                        _this.$bus.$emit('outputUpdate', source);
                    }
                )
            })
        }
    },
    mounted: function() {
        var _this = this;
        this.environment = $(this.$el).closest('#Components').length ? 'components' : 'stage';
        this.config._index = Index.getDomIndex(this.$el);
        Cmint.actionBarHandler(this);
        Util.debug('mounted "' + this.config._name + '" at ' + this.config._index);
        $('a').click(function(e) {
            e.preventDefault();
        })
        Editor.runHook(this, 'editor');
        Editor.init(this);
    },
    updated: function() {
        var _this = this;
        this.$bus.$on('deconstruct', function() {
            _this.deconstruct = !_this.deconstruct;
        })
        this.environment = $(this.$el).closest('#Components').length ? 'components' : 'stage';
        this.config._index = Index.getDomIndex(this.$el);
        Cmint.actionBarHandler(this);
        Util.debug('updated "' + this.config._name + '" at ' + this.config._index);
        $('a').click(function(e) {
            e.preventDefault();
        })
        Editor.runHook(this, 'editor');
        Editor.init(this);
    }
})