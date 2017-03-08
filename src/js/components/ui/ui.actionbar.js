Vue.component('actionbar', {

    template: '\
        <div id="ActionBar" :style="css" :class="{active: isActive, cmint: true}">\
            <button class="actionbar-copy" @click="copyComponent">\
                <i class="fa fa-clone"></i></button>\
            <button class="actionbar-trash" @click="trashComponent">\
                <i class="fa fa-trash-o"></i></button>\
            <button :class="{\'actionbar-new\':true, custom: isCustom}" @click="callCustomModal">\
                <i :class="customClasses"></i></button>\
            <button :class="{\'actionbar-fields\': true, hidden: noFields}" @click="callFields">\
                <i class="fa fa-cog"></i></button>\
        </div>',

    data: function() {
        return {
            top: '20px',
            left: '20px',
            display: 'block',
            isActive: false,
            noFields: true,
            newComp: false,
            focused: false,
            isCustom: false
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
        },
        customClasses: function() {
            return {
                'fa': true,
                'fa-plus': !this.isCustom,
                'fa-star': this.isCustom
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
            // Cmint.Ui.callCustomModal(this);
            Cmint.Bus.$emit('callCustomModal');
        },

        callFields: function() {
            Cmint.Bus.$emit('callComponentFields');
            Cmint.Bus.$emit('toggleOverlay', true);
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
            _this.isCustom = Cmint.App.activeComponent.config.custom;
            var left = _this.left.replace('px','') * 1;
            var top = _this.top.replace('px','') * 1;
            if (left < 48) {
                _this.left = '48px';
            }
            if (top < 45) {
                _this.top = '45px';
            }
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