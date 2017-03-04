Vue.component('content-template', {

    props: ['fields-component', 'template', 'stage'],

    template: '',

    data: function() {return {
        sidebarOpen: true,
        toolbarOpen: true
    }},

    computed: {
        margin: function() {
            var right = this.sidebarOpen ? '360px' : '0';
            var top = this.toolbarOpen ? '40px' : '0';
            return {
                'margin-right': right,
                'margin-top': top
            }
        }
    },

    created: function() {
        var stage = '<context id="Stage" :contexts="stage" data-context="stage"></context>';
        var template = '<div id="Template" :style="margin">';
        template += this.template.replace(/\{\{\s*stage\s*\}\}/, stage);
        template += '</div>';
        this.$options.template = template;
    },

    mounted: function() {
        var _this = this;
        Cmint.Bus.$on('toggleSidebar', function(isOpen) {
            if (isOpen) {
                _this.sidebarOpen = true;
                _this.toolbarOpen = true;
            } else {
                _this.sidebarOpen = false;
            }
        })
        Cmint.Bus.$on('toggleToolbar', function(isOpen) {
            if (!isOpen) {
                _this.toolbarOpen = false;
                _this.sidebarOpen = false;
            } else {
                _this.toolbarOpen = true;
            }
        })
    }

})