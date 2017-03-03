Vue.component('sidebar', {

    props: ['components'],

    template: '\
        <aside id="Sidebar" :class="{active:isActive}">\
            <div class="cmint-sidebar-handle" @click="toggle">\
                <i :class="handleClasses"></i>\
            </div>\
            <div class="sidebar-sub">\
                <categories :components="components"></categories>\
            </div>\
            <div class="sidebar-main">\
                <context id="Components"\
                    data-context="components"\
                    :thumbnails="true"\
                    :contexts="componentList"></context>\
            </div>\
        </aside>',

    data: function(){return{

        isActive: false,
        componentList: this.components

    }},

    computed: {
        handleClasses: function() {
            var classes = {fa:true};
            if (this.isActive) {
                classes['fa-close'] = true;
            } else {
                classes['fa-bars'] = true;
            }
            return classes;
        },
        // componentList: function() {
        //     return this.components;
        // }
    },

    methods: {

        toggle: function() {
            this.isActive = !this.isActive;
            this.$bus.$emit('toggleSidebar', this.isActive);
        }

    },

    mounted: function() {

        var _this = this;
        _this.handleClasses['fa-close'] = true;
        Cmint.Ui.componentList = _this.componentList;

        _this.$bus.$on('filteredCategories', function(filtered) {
            _this.componentList = filtered;
            console.log(_this.componentList);
            Cmint.Ui.componentList = _this.componentList;
        })

        _this.$bus.$on('updateComponentList', function(listing) {

            _this.componentList = listing;
        })

        _this.$bus.$on('toggleToolbar', function(toolbarState) {
            if (!toolbarState) {
                _this.isActive = false;
            }
        })

    }

})