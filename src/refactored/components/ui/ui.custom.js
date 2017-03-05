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
            Cmint.AppFn.createCustomComponent(this);
        }
    }

})