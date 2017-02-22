Vue.component('field-text', {
    props: ['field', 'component'],
    // We've put a layer between the component's data tied to the DOM and the data entered
    // into the field. This is because some fields need to process the input in order to
    // deliver the final output to the vm data.
    // The input element is bound to the field's input data. On the input event, the data
    // in the input is processed and sent to the designated component._fields.output key.
    // During processing, if the component has tokens defined, the input will be run through
    // Cmint.tokenize().
    template:'\
        <div class="field-instance">\
            <label>{{ field.label }}</label>\
            <input type="text" v-model="field.inputs[fields[field.name].input]" @input="process()" />\
        </div>',
    data: function() { return {
        fields: Fields
    }},
    methods: {
        process: _.debounce(function() {
            var result = this.component._fields.output[this.field.result];
            var fieldData = Fields[this.field.name];
            var input = this.field.inputs[fieldData.input];
            if (this.component._tokens) {
                input = Cmint.tokenize(input, this.component);
            }
            this.component._fields.output[this.field.result] = input;
        }, 500)
    },
    mounted: function() {
        this.process();
    }

})