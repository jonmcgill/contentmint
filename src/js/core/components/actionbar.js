Vue.component('actionbar', {
    template: '\
        <div id="ActionBar" :style="css" :class="{active: isActive, cmint: true}">\
            <button class="actionbar-copy" @click="copyComponent">\
                <i class="fa fa-clone"></i></button>\
            <button class="actionbar-trash" @click="trashComponent">\
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
        trashComponent: function() {
            var comp = Cmint.app.focusedComponent;
            var index = Index.retrieveVueContext(comp.config._index, Cmint.app);

            index.context.splice(index.key, 1);

            Vue.nextTick(Cmint.app.refresh);
            Vue.nextTick(Drag.updateContainers);
            Vue.nextTick(Cmint.app.snapshot);
            this.$bus.$emit('closeActionBar');
            Util.debug('trashed ' + comp.config._name + '[' + comp.config._index + ']');
        },
        copyComponent: function() {
            var comp = Cmint.app.focusedComponent;
            var index = Index.retrieveVueContext(comp.config._index, Cmint.app);
            var clone = Util.copy(index.context[index.key])

            index.context.splice(index.key + 1, 0, clone);

            Vue.nextTick(Cmint.app.refresh);
            Vue.nextTick(Drag.updateContainers);
            Vue.nextTick(Cmint.app.snapshot);
            this.$bus.$emit('closeActionBar');
            Util.debug('copied ' + comp.config._name + '[' + comp.config._index + ']');
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