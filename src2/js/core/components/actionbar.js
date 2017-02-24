Vue.component('actionbar', {
    template: '\
        <div id="ActionBar" :style="css" :class="{active: isActive, cmint: true}">\
            <button class="actionbar-copy">\
                <i class="fa fa-clone"></i></button>\
            <button class="actionbar-trash">\
                <i class="fa fa-trash-o"></i></button>\
            <button :class="{\'actionbar-fields\': true, hidden: noFields}" @click="callFields">\
                <i class="fa fa-cog"></i></button>\
        </div>',
    data: function(){return{
        top: '20px',
        left: '20px',
        display: 'block',
        isActive: false,
        noFields: true
    }},
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
        callFields: function() {
            this.$bus.$emit('callComponentFields', Cmint.app.focusedComponent);
        }
    },
    mounted: function() {
        var _this = this;
        this.$bus.$on('getComponentCoordinates', function(spot, component) {
            _this.top = spot.top;
            _this.left = spot.left;
            _this.hasFields = component._fields;
            _this.display = 'block';
        })
        this.$bus.$on('openActionBar', function(component) {
            _this.noFields = component.config._fields === undefined;
            _this.isActive = true;
            Util.debug('component in focus: ' + this.hasFields);
        })
        this.$bus.$on('closeActionBar', function() {
            if (_this.isActive) {
                _this.isActive = false;
                setTimeout(function() {
                    _this.display = 'none';
                }, 200)
            }
        })
    }
})