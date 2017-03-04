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
        fields: Cmint.Instance.Fields.List,
        pass: true
    }},

    computed: {
        check: function() {
            return this.pass ? {'color': 'rgba(0,0,0,0.4)'} : {'color': '#E57373'};
        }
    },

    methods: {
        process: _.debounce(function() {
            Cmint.Fields.processFieldText(this);
        }, 500)
    },

    beforeMount: function() {
        Cmint.Fields.watchOutputUpdates(this);
    },

    mounted: function() {
        var _this = this;
        Cmint.Fields.processFieldText(_this);
        Cmint.Bus.$on('fieldProcessing', function() {
            Cmint.Fields.processFieldText(_this);
            Cmint.Util.debug('processed field "'+_this.field.name+'" after tinymce editing');
        })
        Cmint.Util.debug('mounted <field> "'+this.field.name+'"');
    }

})