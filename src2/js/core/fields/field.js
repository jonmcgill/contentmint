Vue.component('field', {
    props: ['field', 'component'],
    template: '\
        <div class="field-wrap">\
            <component :is="field.type" :field="field" :component="component"></component>\
        </div>',
    beforeMount: function() {
        // result = default output listed in component
        var result = this.component._fields.output[this.field.result];
        // field instances aren't components; they're object literals passed to field components
        var fieldData = Fields[this.field.name];
        this.field.label = fieldData.label;
        this.field.type = fieldData.type;
        // if no inputs, this is the first instantiation of this field for a given component.
        // inputs are established based on the defaults provided to the fieldData and the components
        if (!this.field.inputs) {
            this.field.inputs = {};
            this.field.inputs[fieldData.input] = result;
        }
    }
})