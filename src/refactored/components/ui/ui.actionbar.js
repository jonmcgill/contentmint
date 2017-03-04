Vue.component('actionbar', {

    template: '\
        <div id="ActionBar" :style="css" :class="{active: isActive, cmint: true}">\
            <button class="actionbar-copy" @click="copyComponent">\
                <i class="fa fa-clone"></i></button>\
            <button class="actionbar-trash" @click="trashComponent">\
                <i class="fa fa-trash-o"></i></button>\
            <button class="actionbar-new" @click="callCustomModal">\
                <i class="fa fa-plus"></i></button>\
            <button :class="{\'actionbar-fields\': true, hidden: noFields}" @click="callFields">\
                <i class="fa fa-cog"></i></button>\
            <custom v-if="newComp" :component="focused"></custom>\
        </div>',

    data: function() {
        return {
            top: '20px',
            left: '20px',
            display: 'block',
            isActive: false,
            noFields: true,
            newComp: false,
            focused: false 
        }
    },

    computed: {
        css: function() {
            return {
                'display': this.display,
                'top': this.top,
                'left': this.left,
                'position': 'absolute'
            }
        }
    },

    methods: {

        trashComponent: function() {
            Cmint.Ui.removeComponent();
        },

        copyComponent: function() {
            Cmint.Ui.copyComponent();
        },

        callCustomModal: function() {
            Cmint.Ui.callCustomModal(this);
        },

        callFields: function() {
            this.$bus.$emit('callComponentFields');
            this.$bus.$emit('closeActionBar');
        }
    },

    mounted: function() {
        var _this = this;
        this.$bus.$on('getComponentCoordinates', function(spot, component) {
            _this.top = spot.top;
            _this.left = spot.left;
            _this.hasFields = component.fields;
            _this.display = 'block';
        })
        this.$bus.$on('openActionBar', function(component) {
            _this.noFields = component.config.fields === undefined;
            _this.isActive = true;
            Cmint.Util.debug('active component is "'+Cmint.App.activeComponent.config.name+'"');
        })
        this.$bus.$on('closeActionBar', function() {
            if (_this.isActive) {
                _this.isActive = false;
                _this.newComp = false;
                setTimeout(function() {
                    _this.display = 'none';
                }, 200)
            }
        })
        this.$bus.$on('closeNewComp', function() {
            _this.newComp = false;
        })
    }

})