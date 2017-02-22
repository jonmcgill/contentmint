Vue.component('fields', {
    props: ['component'],
    template: '\
        <div class="fields-container">\
            <div class="field-tokens" v-if="component._tokens">Available tokens: {{ tokens }}</div>\
            <field v-for="field in component._fields.list" :field="field" :component="component"></field>\
        </div>',
    computed: {
        tokens: function() {
            return this.component._tokens.map(function(pair) {
                return '{{'+ Object.keys(pair)[0] + '}}';
            }).join(', ');
        }
    }
})