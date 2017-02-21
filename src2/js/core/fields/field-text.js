Vue.component('field-text', {
    props: ['field', 'component'],
    // We've put a layer between the component's data tied to the DOM and the data entered
    // into the field. This is because some fields need to process the input in order to
    // deliver the final output to the vm data.
    // The input element is bound to the field's input data. On the input event, the data
    // in the input is processed and sent to the designated component._fields.output key
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
            this.component._fields.output[this.field.result] = input;
        }, 500)
    },
    mounted: function() {
        this.process();
    }

})