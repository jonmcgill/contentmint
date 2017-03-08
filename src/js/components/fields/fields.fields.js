Vue.component('fields', {
    props: ['component', 'mountonly'],
    template: '\
        <div :class="wrapClasses">\
            <div class="fields-top">\
                <button class="fields-close-btn" @click="close">\
                    <i class="fa fa-chevron-left"></i>Done\
                </button>\
                <div class="fields-header">{{ component.display }}</div>\
                <div class="field-tokens" v-if="component.tokens">\
                    <i class="fa fa-question-circle-o"></i>\
                    <span>Tokens: </span><span class="token-wrap" v-html="tokens"></span>\
                </div>\
            </div>\
            <div class="field-list">\
                <field v-for="field in component.fields.list" :field="field" :component="component" :key="field.id"></field>\
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
            return this.component.tokens.map(function(pair) {
                return '<span>{{ '+ Object.keys(pair)[0] + ' }}</span>';
            }).join(', ');
        }
    },
    methods: {
        open: function(mountOnly) {
            var _this = this;
            if (!mountOnly) {
                setTimeout(function() {
                    _this.isActive = true;
                },50);
            } else {
                setTimeout(function() {
                    Cmint.App.fieldsComponent = null;
                })
            }
        },
        close: function() {
            var _this = this;
            setTimeout(function() {
                _this.isActive = false;
                // Cmint.Bus.$emit('closeFieldWidget');
                Cmint.Bus.$emit('toggleOverlay', false);
                setTimeout(function() {
                    Cmint.App.fieldsComponent = null;
                    Vue.nextTick(Cmint.App.snapshot);
                    Cmint.App.save();
                },200)
                Cmint.Util.debug('closed field wiget');
            },50);
            
        }
    },
    mounted: function() {
        if (!this.mountonly) {
            this.open();
            Cmint.Util.debug('opened fields for "' + this.component.name + '"');
        } else {
            Cmint.Util.debug('only mounting field component "'+this.component.name+'"')
        }
    }
})