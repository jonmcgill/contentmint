Vue.component('wrap', {
    props: ['config'],
    template: '\
        <div class="Component" @click="showFields">\
            <component :is="config._name" :config="config"></component>\
        </div>',
    methods: {
        showFields: function() {
            this.$emit('showfields', this.config);
        }
    },
    mounted: function() {
        this.config._index = Index.getDomIndex(this.$el);
        Util.debug('mounted "' + this.config._name + '" at ' + this.config._index);
    },
    updated: function() {
        this.config._index = Index.getDomIndex(this.$el);
        Util.debug('updated "' + this.config._name + '" at ' + this.config._index);
    }
})