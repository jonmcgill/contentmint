Vue.component('field-choice', {
    props: ['field', 'component'],
    template: '\
        <div class="field-instance field-choice-container">\
            <label class="field-choice-label">{{ field.label }}</label>\
            <div :class="{\'field-choice-wrap\':true, active: toggle}">\
                <div class="field-selected" @click="toggle = !toggle">\
                    <span>{{ selected }}</span><i :class="chevron"></i>\
                </div>\
                <div class="field-choices">\
                    <div v-for="choice in field.choices"\
                         v-text="displayName(choice)"\
                         @click="process(choice)"></div>\
                </div>\
            </div>\
            <div class="field-selected-field-wrap" v-if="selected !== \'None\'">\
                <field :field="selectionData" :component="component"></field>\
            </div>\
        </div>',
    data: function() { return {
        toggle: false,
        fields: Fields,
        selected: this.field.selected || 'None',
        selectionData: this.field.selectionData || null,
        selectedFieldData: this.field.selectedFieldData || null
    }},
    computed: {
        chevron: function() {
            return {
                'fa': true,
                'fa-chevron-left': !this.toggle,
                'fa-chevron-down': this.toggle
            }
        }
    },
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
            _this.toggle = false;
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
    mounted: function() {
        var _this = this;
        this.$bus.$on('closeFieldChoice', function() {
            _this.toggle = false;
        })
    },
    beforeMount: function() {
        if (this.field.choices[0] !== 'None') {
            this.field.choices.splice(0, 0, 'None');
        }
    }
})