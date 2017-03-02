Vue.component('sidebar', {

    props: ['components'],

    template: '\
        <aside id="Sidebar">\
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

        componentList: this.components

    }},

    mounted: function() {

        var _this = this;

        _this.$bus.$on('filteredCategories', function(filtered) {
            _this.componentList = filtered;
        })

    }

})