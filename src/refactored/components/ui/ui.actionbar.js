Vue.component('actionbar', {

    template: '\
        <div id="ActionBar" :style="css" :class="{active: isActive, cmint: true}">\
            <button class="actionbar-copy" @click="copyComponent">\
                <i class="fa fa-clone"></i></button>\
            <button class="actionbar-trash" @click="trashComponent">\
                <i class="fa fa-trash-o"></i></button>\
            <button class="actionbar-new" @click="newComponent">\
                <i class="fa fa-plus"></i></button>\
            <button :class="{\'actionbar-fields\': true, hidden: noFields}" @click="callFields">\
                <i class="fa fa-cog"></i></button>\
            <custom-add v-if="newComp" :component="focused"></custom-add>\
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
            var comp = Cmint.App.activeComponent;
            var position = Cmint.Sync.getVmContextData(comp.config.index, Cmint.App.stage);

            position.context.splice(position.index, 1);

            // Vue.nextTick(Cmint.app.refresh);
            // Vue.nextTick(Drag.updateContainers);
            // Vue.nextTick(Cmint.app.snapshot);
            // Cmint.app.save();

            this.$bus.$emit('closeActionBar');
            Cmint.Util.debug('trashed ' + comp.config.name + '[' + comp.config.index + ']');
        },

        copyComponent: function() {
            var comp = Cmint.App.activeComponent;
            var position = Cmint.Sync.getVmContextData(comp.config.index, Cmint.App.stage);
            var clone = Cmint.Util.copyObject(position.context[position.index])

            position.context.splice(position.index + 1, 0, clone);

            // Vue.nextTick(Cmint.app.refresh);
            // Vue.nextTick(Drag.updateContainers);
            // Vue.nextTick(Cmint.app.snapshot);
            // Cmint.app.save();

            this.$bus.$emit('closeActionBar');
            Cmint.Util.debug('copied ' + comp.config.name + '[' + comp.config.index + ']');
        },

        newComponent: function() {
            var comp = Cmint.App.activeComponent;
            var position = Cmint.Sync.getVmContextData(comp.config.index, Cmint.App.stage);
            var clone = Cmint.Util.copyObject(position.context[position.index]);
            this.focused = clone;
            this.newComp = !this.newComp;
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
            Cmint.Util.debug('component in focus: ' + this.hasFields);
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