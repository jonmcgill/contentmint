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
            s.to = s.to || '';
            s.subject = s.subject || '';
            s.body = s.body  || '';
            var linkText = 'mailto:';
            linkText += s.to + '?';
            linkText += 'Subject='+encodeURIComponent(s.subject)+'&';
            linkText += 'Body='+encodeURIComponent(s.body)+'&';
            s[this.field.result] = linkText;
        },
        telLink: function() {
            var s = this.config.settings;
            s.number = s.number || '';
            if (s.number) {
                s[this.field.result] = 'tel:' + s.number;
            }
        }
    },

    mounted: function() {
        var _this = this;
        _this[_this.field.type.effect]();
        dataToDOMJSON(_this.config, getParentDOMComponent(_this.$el));
        $(this.$el)
            .find('input, textarea, .menu-selected')
            .on('keyup click', function() {
                _this[_this.field.type.effect]();
                dataToDOMJSON(_this.config, getParentDOMComponent(_this.$el));
            })
    }

})