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
                    :field="fieldData[field]"\
                    :config="config"></field>\
        </div>',

    data: function() {
        return {
            fieldData: fieldData
        }
    },

    methods: {

        closeSettings: function() {
            var _this = this;
            var component = this.$root.activeComponent.$el;
            $(_this.$el).removeClass('active');
            setTimeout(function() {
                _this.config.settings.active = false;
                _this.$root.fieldsOpen = false;
                _this.$root.activeComponent = false;
                setSettingsProperty(component, 'active', false);
            }, 250)
        }

    }

})
