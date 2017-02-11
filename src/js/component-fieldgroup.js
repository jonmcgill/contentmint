//
//  src/js/component-fieldgroup.js
//
Vue.component('fieldgroup', {

    props: ['field', 'fields', 'config'],

    template: '\
    <div class="field-group-field">\
        <field v-for="fld in fields" :field="fld" :config="config"></field>\
    </div>',

    methods: {
        mailto: function() {
            var s = this.config.settings;
            var linkText = 'mailto:';
            linkText += s.to + '?';
            linkText += 'Subject='+encodeURIComponent(s.subject)+'&';
            linkText += 'Body='+encodeURIComponent(s.body)+'&';
            s[this.field.result] = linkText;
        }
    },

    mounted: function() {
        var _this = this;
        _this[_this.field.type.effect]();
        $(this.$el)
            .find('input, textarea, .menu-selected')
            .on('keyup click', function() {
                _this[_this.field.type.effect]();
            })
    }

})