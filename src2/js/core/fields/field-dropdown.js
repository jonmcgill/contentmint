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
        fields: Fields,
        menu: Menus[this.field.menu],
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
            var output = Menus[this.field.menu][selection];
            if (this.field.hook) {
                output = Process[this.field.hook](output);
            }
            this.field.inputs[this.fields[this.field.name].input] = selection;
            this.selected = selection;
            this.component._fields.output[this.field.result] = output;
        }
    },
    beforeMount: function() {
        this.selected = this.field.inputs[this.fields[this.field.name].input] || 'Default';
        this.process(this.selected);
    }
})