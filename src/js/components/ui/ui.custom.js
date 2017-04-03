Vue.component('custom', {

    template: '\
        <div :class="classes">\
            <div class="custom-heading">\
                <button class="custom-done" @click="closeCustom"><i class="fa fa-chevron-left"></i>Done</button>\
                <span>Custom Component</span>\
            </div>\
            <div class="custom-form">\
                <label>Name</label>\
                <input type="text" v-model="name" placeholder="Component name" :disabled="isCustom || null" />\
                <div :class="{ nameError: true, show: hasError }" v-text="nameError"></div>\
                <label>Category</label>\
                <input type="text" v-model="category" placeholder="Category (Default \'Custom\')" :disabled="isCustom || null" />\
                <button v-if="!isCustom" class="add-btn" @click="addCustom">Save Component</button>\
                <button v-if="isCustom" class="delete-btn" @click="deleteCustom">Delete</button>\
            </div>\
        </div>',

    // Removing this for now. See below.
    //<button v-if="isCustom" class="update-btn" @click="updateCustom">Update Component</button>\
    
    data: function() {return{
        name: '',
        category: '',
        nameError: false,
        hasError: false,
        isActive: false,
        isCustom: false
    }},

    computed: {
        classes: function() {
            return {
                'custom-add-wrap': true, 
                cmint: true, 
                active: this.isActive
            }
        }
    },

    methods: {
        addCustom: function() {
            Cmint.AppFn.createCustomComponent(this);
        },
        // This is probably taking things a bit too far at the moment. Updating custom components
        // the way I'm doing with this function wouldn't actually be intuititive for the user and
        // would cause confusion when other pieces of content are opened with that custom component
        // since they wouldn't match up. For now, you can just add or delete custom structures.
        // Instances of those custom structures can be manipulated without modifying the original.
        // updateCustom: function() {
        //     Cmint.AppFn.updateCustomComponent(this);
        // },
        deleteCustom: function() {
            Cmint.AppFn.deleteCustomComponent(this);
        },
        closeCustom: function() {
            Cmint.Bus.$emit('closeCustomModal');
        }
    },

    mounted: function() {

        var _this = this;

        Cmint.Bus.$on('callCustomModal', function() {
            Cmint.Bus.$emit('toggleOverlay', true);
            _this.isCustom = Cmint.App.activeComponent.config.custom;
            _this.name = _this.isCustom ? Cmint.App.activeComponent.config.display : '';
            _this.category = _this.isCustom ? Cmint.App.activeComponent.config.category : '';
            _this.isActive = true;
        })

        Cmint.Bus.$on('closeCustomModal', function() {
            Cmint.Bus.$emit('toggleOverlay', false);
            _this.isActive = false;
            _this.name = '';
            _this.category = '';
        })

        Cmint.Bus.$on('overlayClick', function() {
            _this.closeCustom();
        })

    }

})