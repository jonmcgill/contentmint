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
        fields: Cmint.Instance.Fields.List
    }},
    methods: {
        process: function() {
            var output,
                _this = this,
                _processes = Cmint.Instance.Fields.Processes;
            if (_this.field.processes) {
                _this.field.processes.forEach(function(fn) {
                    output = _processes[fn](_this.field.inputs, _this.component)
                })
            } else {
                console.error('Field groups must have associated processes');
            }
            this.component.fields.output[this.field.result] = output;
        },
        firstUppercase: function(txt) {
            return txt.charAt(0).toUpperCase() + txt.replace(/^./,'');
        }
    },
    beforeMount: function() {
        Cmint.Fields.watchOutputUpdates(this);
    },
    mounted: function() {
        var _this = this;
        Cmint.Bus.$on('fieldProcessing', function() {
            _this.process();
            Cmint.Util.debug('processed field "'+_this.field.name+'" after tinymce editing');
        });
    }
})