Vue.component('sidebar', {
    props: ['user', 'name', 'components', 'fieldsComponent'],
    template: '\
        <aside id="Sidebar">\
            <div class="sidebar-sub">\
                <categories :components="components"></categories>\
            </div>\
            <div class="sidebar-main">\
                <context id="Components"\
                    data-context-name="components"\
                    :thumbnails="true"\
                    :children="componentList"></context>\
            </div>\
            <div class="sidebar-fields">\
                \
            </div>\
        </aside>',
    computer: {
        componentList: function() {
            return this.components;
        }
    },
    mounted: function() {
        Cmint.componentList = this.componentList;
        var _this = this;
        this.$bus.$on('filteredCategories', function(filtered) {
            _this.componentList = filtered;
            Cmint.componentList = _this.componentList;
        })
    }
})