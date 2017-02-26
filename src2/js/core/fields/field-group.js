Vue.component('field-group', {
    props: ['field', 'component'],
    template: '\
        <div class="field-instance">\
            <label>{{ field.label }}</label>\
            <div class="field-group-wrap">\
                <div class="field-group-input" v-for="(inp, key) in field.inputs">\
                    <label>{{ firstUppercase(key) }}</label>\
                    <input type="text" v-if="inp.type === \'input\'"\
                        v-model="field.inputs[key].value"\
                        @keyup="process()"\
                        :placeholder="inp.label" />\
                    <textarea v-else-if="inp.type === \'textarea\'"\
                        v-model="field.inputs[key].value"\
                        @keyup="process()"\
                        :placeholder="inp.label"></textarea>\
                </div>\
            </div>\
        </div>',
    data: function() { return {
        fields: Fields
    }},
    methods: {
        process: function() {
            var _this = this;
            var output = Process[this.field.hook](this.field.inputs, this.component);
            this.component._fields.output[this.field.result] = output;
        },
        firstUppercase: function(txt) {
            return txt.charAt(0).toUpperCase() + txt.replace(/^./,'');
        }
    },
    beforeMount: function() {
        Cmint.watchOutputUpdates(this);
    },
    mounted: function() {
        var _this = this;
        this.$bus.$on('fieldProcessing', function() {
            _this.process();
            Util.debug('processing ' + _this.field.name + ' after editor updates');
        });
    }
})