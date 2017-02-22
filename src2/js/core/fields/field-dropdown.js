Vue.component('field-dropdown', {
    props: ['field', 'component'],
    template: '\
        <div class="field-instance">\
            <label>{{ field.label }}</label>\
            <div class="dropdown">\
                <button v-text="selected"></button>\
                <div class="dropdown-list">\
                    <button v-for="(item, key) in menu"\
                            v-text="key"\
                            @click="process(key)"></button>\
                </div>\
            </div>\
        </div>',
    data: function() { return {
        fields: Fields,
        menu: Menus[this.field.menu],
        selected: 'Default'
    }},
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