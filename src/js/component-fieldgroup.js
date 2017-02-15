//
//  src/js/component-fieldgroup.js
//
Vue.component('fieldgroup', {

    props: ['field', 'fields', 'config'],

    template: '\
    <div class="field-group-field">\
        <field v-for="fld in fields" :field="fld" :config="config"></field>\
        <div class="field-tokens" v-if="config.tokens">\
            <p>\
                <strong>Available tokens: </strong><span v-html="displayTokens()"></span>\
            </p>\
        </div>\
    </div>',

    methods: {
        displayTokens: function() {
            if (this.config.tokens) {
                return this.config.tokens.map(function(token) {
                    return token[0]
                }).join(', ');
            }
        }
    },

    mounted: function() {
        var _this = this;
        var component = this.$root.activeComponent.$el;
        effects[_this.field.type.effect](this, this.field.result);
        dataToDOMJSON(_this.config, component);
        $(this.$el)
            .find('input, textarea, .menu-selected')
            .on('keyup click', function() {
                effects[_this.field.type.effect](_this, _this.field.result);
                dataToDOMJSON(_this.config, component);
            })
    }

})
