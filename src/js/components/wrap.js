Vue.component('wrap', {
    props: ['config'],
    render: function(make) {
        var tag = this.config._rootTag || 'div';
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

/**

    Unfortunately, I did not take advantage of slots when I originally designed the component system.
    Most of it will have to be redone, including the Indexing which is going to be painful and terrible.

    This new system uses wrapper and contextual components as insubstantial wrappers around actual
    components. I ran into a problem when I needed to override component and context root tags, so this
    is necessary to ensure the dev can create components like tables, for instance.

**/
var TESTDATA = {
    name: 'test',
    tags: {
        root: 'table',
        cell: 'td'
    },
    children: {
        cell: [{
            name: 'testing',
            tags: {
                root: 'p'
            }
        }]
    }
}

Vue.component('wrapper', {
    props: ['config'],
    render: function(make) {
        return make(this.config.tags.root, {'class': {'Component': true}}, this.$slots.default)
    }
})
Vue.component('contextual', {
    props: ['tag', 'children'],
    render: function(make) {
        return make(this.tag,
            // options
            {
                'class': {'Context': true}
            },
            // children
            this.children.map(function(child) {
                return make(child.name,
                    { props: { 'config': child } }
                );
            })
        )
    }
})
Vue.component('testing', {
    props: ['config'],
    template: '\
        <wrapper :config="config">\
            This is some paragraph text.\
        </wrapper>',
})
Vue.component('test', {
    props: ['config'],
    template: '\
        <wrapper :config="config" cellpadding="10" cellspacing="10" border="1">\
            <tr>\
                <contextual :tag="config.tags.cell" :children="config.children.cell"></contextual>\
            </tr>\
        </wrapper>'
})


