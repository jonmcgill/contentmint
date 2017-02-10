//
//  src/js/component-settings.js
//
Vue.component('field', {
    props: ['field', 'settings'],
    template: '\
    <div class="field-instance" v-if="field.type.name === \'text\'">\
        <label>{{ field.label }}</label>\
        <input  v-model="settings[field.result]" />\
    </div>\
    ',
    mounted: function() {
        var _this = this;

        // Handles simple text input
        $(this.$el).find('input').on('keyup', function() {
            var $comp = $(this).closest('.Component');
            data = JSON.parse($comp.attr(g.name.config));
            data.settings[_this.field.result] = $(this).val();
            $comp.attr(g.name.config, JSON.stringify(data));
        })



    }
})