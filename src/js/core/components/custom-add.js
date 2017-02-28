Vue.component('custom-add', {
    props: ['component'],
    template: '\
        <div class="custom-add-wrap">\
            <span>Custom Component Information</span>\
            <input type="text" v-model="name" placeholder="Component name" />\
            <input type="text" v-model="category" placeholder="Component category" />\
            <button @click="addComponent">Save Component</button>\
            <div class="nameError" v-if="nameError">{{nameError}}</div>\
        </div>',
    data: function() {return{
        name: '',
        category: '',
        nameError: false
    }},
    methods: {
        addComponent: function() {
            var D = Cmint.app.Data;
            var double = false;
            var _this = this;
            if (!D.customComponents[D.template]) {
                D.customComponents[D.template] = [];
            }
            if (this.name === '') {
                this.nameError = 'Name field is blank';
                return;
            }
            Cmint.app.components.forEach(function(c) {
                if (c._display === _this.name + ' (Custom)') {
                    double = true;
                }
            })
            if (!double) {
                var comp = Util.copy(this.component);
                comp._display = this.name + ' (Custom)';
                comp._category = this.category || 'Custom';
                Cmint.app.components.push(comp);
                Util.debug('added "' + this.name + '" ('+this.category+') in template "'+D.template+'"');
                this.$bus.$emit('closeNewComp');
            } else {
                this.nameError = 'Name already exists';
                this.name = '';
            }
        }
    }
})