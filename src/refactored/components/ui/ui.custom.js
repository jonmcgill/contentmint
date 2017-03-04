Vue.component('custom', {
    
    props: ['component'],

    template: '\
        <div class="custom-add-wrap">\
            <span>Custom Component Information</span>\
            <input type="text" v-model="name" placeholder="Component name" />\
            <input type="text" v-model="category" placeholder="Category (Default \'Custom\')" />\
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
            // var D = Cmint.app.Data;
            var double = false;
            var _this = this;
            if (!Cmint.App.customComponents) {
                Cmint.App.customComponents = [];
            }
            if (this.name === '') {
                this.nameError = 'Name field is blank';
                return;
            }
            Cmint.App.components.forEach(function(component) {
                if (component.display === _this.name) {
                    double = true;
                }
            })
            if (!double) {
                var comp = Cmint.Util.copyObject(this.component);
                comp.display = this.name;
                comp.category = this.category || 'Custom';
                Cmint.App.components.push(comp);
                if (comp.category === Cmint.App.selectedCategory) {
                    this.$bus.$emit('updateComponentList', comp);
                }
                Cmint.Util.debug('added "' + this.name + '" ('+this.category+') in template "'+Cmint.App.templateName+'"');
                this.$bus.$emit('closeNewComp');
            } else {
                this.nameError = 'Name already exists';
                this.name = '';
            }
        }
    }

})