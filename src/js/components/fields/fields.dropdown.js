Vue.component('field-dropdown', {

    props: ['field', 'component'],

    template: '\
        <div class="field-instance">\
            <label>{{ field.label }}</label>\
            <div :class="{dropdown:true, active:toggle}">\
                <button @click="toggle = !toggle">\
                    <span>{{ selected }}</span><i :class="chevron"></i>\
                </button>\
                <div class="dropdown-list">\
                    <button v-for="(item, key) in menu"\
                            v-text="key"\
                            @click="process(key); toggle = !toggle"></button>\
                </div>\
            </div>\
        </div>',

    data: function() { return {
        fields: Cmint.Instance.Fields.List,
        menu: Cmint.Instance.Menus[this.field.menu],
        selected: 'Default',
        toggle: false
    }},
    computed: {
        chevron: function() {
            return {
                'fa': true, 'fa-chevron-left': !this.toggle, 'fa-chevron-down': this.toggle
            }
        }
    },
    methods: {
        process: function(selection) {
            var _menus = Cmint.Instance.Menus;
            var _fields = Cmint.Instance.Fields.List;
            var _processes = Cmint.Instance.Fields.Processes;
            var _this = this;
            var output = _menus[this.field.menu][selection];
            if (this.field.processes) {
                this.field.processes.forEach(function(fn) {
                    output = _processes[fn](output, this.component, this.field);
                })
            }
            this.field.inputs[_fields[this.field.name].input] = selection;
            this.selected = selection;
            this.component.fields.output[this.field.result] = output;
        }
    },
    beforeMount: function() {
        this.selected = this.field.inputs[this.fields[this.field.name].input] || 'Default';
        this.process(this.selected);
    },
    mounted: function() {
        var _this = this;
        _this.$bus.$on('closeDropdown', function() {
            _this.toggle = false;
        })
    }
})