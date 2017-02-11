//
//  src/js/field-widget.js
//
Vue.component('field-widget', {

    props: ['config'],

    template: '\
        <div v-if="config.settings.active" class="field-widget">\
            <button class="field-btn-back" @click="closeSettings">\
                <i class="fa fa-chevron-left"></i>Components\
            </button>\
            <h2>Settings: {{ config.display }}</h2>\
            <field v-for="field in config.fields"\
                    :field="field"\
                    :config="config"></field>\
        </div>',

    methods: {

        closeSettings: function() {
            var _this = this;
            $(_this.$el).removeClass('active');
            setTimeout(function() {
                _this.config.settings.active = false;
                _this.$root.fieldsOpen = false;
            }, 250)
        }

    }

})