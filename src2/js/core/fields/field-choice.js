Vue.component('field-choice', {
    props: ['field', 'component'],
    template: '\
        <div class="field-instance">\
            <label>{{ field.label }}</label>\
            <div class="field-choice-wrap">\
                <span class="field-selected" v-text="selected"></span>\
                <div class="field-choices">\
                    <div v-for="choice in field.choices"\
                         v-text="displayName(choice)"\
                         @click="process(choice)"></div>\
                </div>\
            </div>\
            <div style="background:#eee;padding:0.5em" v-if="selected !== \'None\'">\
                <field :field="selectionData" :component="component"></field>\
            </div>\
        </div>',
    data: function() { return {
        fields: Fields,
        selected: this.field.selected || 'None',
        selectionData: this.field.selectionData || null,
        selectedFieldData: this.field.selectedFieldData || null
    }},
    methods: {
        displayName: function(choice) {
            if (choice === 'None') {
                return 'None';
            } else {
                return this.fields[choice.name].display;
            }
        },
        process: function(selection) {
            var _this = this;
            _this.selectionData = null;
            _this.selectedFieldData = null;
            _this.selected = 'None';

            _this.field.selected = _this.selected;
            _this.field.selectionData = _this.selectionData;
            _this.field.selectedFieldData = _this.selectedFieldData;

            Vue.nextTick(function() {
                if (selection !== 'None') {
                    _this.selectionData = Util.copy(selection);
                    _this.selectedFieldData = _this.fields[_this.selectionData.name];
                    _this.selected = _this.selectedFieldData.display;

                    _this.field.selected = _this.selected;
                    _this.field.selectionData = _this.selectionData;
                    _this.field.selectedFieldData = _this.selectedFieldData;
                }
                Util.debug('field chosen: ' + _this.selected);
            })
        }
    },
    beforeMount: function() {
        if (this.field.choices[0] !== 'None') {
            this.field.choices.splice(0, 0, 'None');
        }
    }
})