Vue.component('field-text', {
    props: ['field', 'component'],
    template:'\
        <div class="field-instance">\
            <label>{{ field.label }}</label>\
            <div class="field-input-wrap">\
                <input type="text" v-model="field.inputs[fields[field.name].input]" @input="process()" />\
                <div class="field-help" v-if="field.help" :style="check">{{ field.help }}</div>\
            </div>\
        </div>',
    data: function() { return {
        fields: Fields,
        pass: true
    }},
    computed: {
        check: function() {
            return this.pass ? {'color': 'rgba(0,0,0,0.4)'} : {'color': '#E57373'}; 
        }
    },
    methods: {
        process: _.debounce(function() {
            var result = this.component._fields.output[this.field.result];
            var fieldData = Fields[this.field.name];
            var input = this.field.inputs[fieldData.input];
            if (this.component._tokens) {
                input = Cmint.tokenize(input, this.component);
            }
            if (this.field.check && input !== '') {
                this.pass = !!input.match(this.field.check);
                Util.debug('field passed - ' + this.pass);
            }
            if (this.field.hook) {
                input = Process[this.field.hook](input);
            }
            this.component._fields.output[this.field.result] = input;
        }, 500)
    },
    beforeMount: function() {
        Cmint.watchOutputUpdates(this);
    },
    mounted: function() {
        this.process();
    }

})