Vue.component('sidebar', {

    props: ['components'],

    template: '\
        <aside id="Sidebar" :class="{active:isActive}">\
            <div class="cmint-sidebar-handle" @click="toggle">\
                <i :class="handleClasses"></i>\
            </div>\
            <div class="sidebar-sub">\
                \
            </div>\
            <div class="sidebar-main">\
                <context id="Components"\
                    data-context="components"\
                    :thumbnails="true"\
                    :containers="components"></context>\
            </div>\
        </aside>',

    data: function(){return{

        componentList: this.components,

        isActive: false,

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
        }
    },

    methods: {

        toggle: function() {
            this.isActive = !this.isActive;
            this.$bus.$emit('toggleSidebar', this.isActive);
        }

    },

    mounted: function() {

        this.handleClasses['fa-close'] = true;

        var _this = this;

        _this.$bus.$on('filteredCategories', function(filtered) {
            _this.componentList = filtered;
        })

        _this.$bus.$on('toggleToolbar', function(toolbarState) {
            if (!toolbarState) {
                _this.isActive = false;
            }
        })

    }

})