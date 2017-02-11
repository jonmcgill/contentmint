//
//  src/js/component-settings.js
//
Vue.component('field', {
    props: ['field', 'config'],
    template: '\
    <div class="field-instance">\
    \
        <div class="field-wrap" v-if="field.type.name === \'text\'">\
            <label>{{ field.label }}</label>\
            <input  v-model="config.settings[field.result]" />\
        </div>\
    \
        <div class="field-wrap" v-if="field.type.name === \'textarea\'">\
            <label>{{ field.label }}</label>\
            <textarea v-model="config.settings[field.result]"></textarea>\
        </div>\
    \
        <div class="field-wrap" v-if="field.type.name === \'dropdown\'">\
            <label>{{ field.label }}</label>\
            <dropdown :field="field" :config="config"></dropdown>\
        </div>\
    \
        <div class="field-wrap" v-if="field.type.name === \'fieldgroup\'">\
            <fieldgroup :field="field" :fields="field.type.fields" :config="config"></fieldgroup>\
        </div>\
    \
    </div>',
    mounted: function() {
        var _this = this;
        // Handles simple text input
        // Updates Vue data and json model on component
        $(this.$el).find('input, textarea, .menu-selected').on('keyup click', function() {
            setComponentJSON(this, $(this).val(), _this.field.result);
        })
    }
})