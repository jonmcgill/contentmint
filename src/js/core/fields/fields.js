Vue.component('fields', {
    props: ['component'],
    template: '\
        <div :class="wrapClasses">\
            <div class="fields-top">\
                <button class="fields-close-btn" @click="close">\
                    <i class="fa fa-chevron-left"></i>Done\
                </button>\
                <div class="fields-header">{{ component._display }}</div>\
                <div class="field-tokens" v-if="component._tokens">\
                    <i class="fa fa-question-circle-o"></i>\
                    <span>Tokens: </span><span class="token-wrap" v-html="tokens"></span>\
                </div>\
            </div>\
            <div class="field-list">\
                <field v-for="field in component._fields.list" :field="field" :component="component" :key="field.id"></field>\
            </div>\
        </div>',
    data: function(){return {
        isActive: false
    }},
    computed: {
        wrapClasses: function() {
            return {
                'cmint': true,
                'fields-container': true,
                'active': this.isActive
            }
        },
        tokens: function() {
            return this.component._tokens.map(function(pair) {
                return '<span>{{ '+ Object.keys(pair)[0] + ' }}</span>';
            }).join(', ');
        }
    },
    methods: {
        open: function() {
            var _this = this;
            setTimeout(function() {
                _this.isActive = true;
            },50);
        },
        close: function() {
            var _this = this;
            setTimeout(function() {
                _this.isActive = false;
                _this.$bus.$emit('closeFieldWidget');
                setTimeout(function() {
                    Cmint.app.fieldsComponent = null;
                    Vue.nextTick(Cmint.app.snapshot);
                },200)
                Util.debug('closed field wiget');
            },50);
            
        }
    },
    mounted: function() {
        this.open();
        Util.debug('opened field wiget with ' + this.component._name)
    },
    // updated: function() {
    //     this.open();
    //     Util.debug('opened field wiget with ' + this.component._name)
    // }
})