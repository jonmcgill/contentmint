Vue.component('toolbar', {

    props: ['changes', 'user', 'name'],

    template: '\
        <div id="Toolbar" :class="{active:isActive}">\
            <div v-for="btn in toolbarButtons" class="cmint-btn-toolbar">\
                <button :class="btn.btnClasses"\
                    @click="btn.callback($el, btn)"\
                    :'+Cmint.Settings.name.dataDisable+'="btn.hasOwnProperty(\'disable\') || null">\
                    <i :class="btn.iconClasses"></i><span>{{ btn.text }}</span>\
                </button>\
            </div>\
            <div id="EditorToolbar"></div>\
            <div class="right">\
                <span>{{ name }}</span><span v-if="user">|</span><a v-if="user" :href="usernameLink">{{ user }}</a>\
            </div>\
            <div class="cmint-toolbar-handle" @click="toggle">\
                <i :class="handleClasses"></i>\
            </div>\
        </div>',

    data: function(){return{

        toolbarButtons: Cmint.Ui.Toolbar,
        isActive: true,
        usernameLink: ''

    }},

    computed: {
        handleClasses: function() {
            var classes = {fa:true};
            if (this.isActive) {
                classes['fa-close'] = true;
            } else {
                classes['fa-cog'] = true;
            }
            return classes;
        }
    },

    methods: {

        toggle: function() {
            this.isActive = !this.isActive;
            this.$bus.$emit('toggleToolbar', this.isActive);
        },

        disable: function(value) {
            var disablers = $(this.$el).find(Cmint.Settings.attr.dataDisable);
            if (value) {
                disablers.attr('disabled', true);
            } else {
                disablers.removeAttr('disabled');
            }
        },

        renderUserLink: function(link) {
            return link.replace(/\{\{\s*username\s*\}\}/, Cmint.App)
        }

    },

    mounted: function() {

        var _this = this;
        _this.disable(true);

        _this.$bus.$on('toolbarDisabler', function(value) {
            _this.disable(value);
        })

        _this.$bus.$on('showToolbar', function() {
            _this.isActive = true;
            this.$bus.$emit('toggleToolbar', true);
        })

        _this.$bus.$on('closeToolbar', function() {
            _this.toggle();
        })

        _this.$bus.$on('toggleSidebar', function(sidebarState) {
            if (sidebarState) {
                _this.isActive = true;
            }
        })

        _this.$bus.$on('renderUsernameLink', function(username) {
            if (Cmint.Settings.config.username && Cmint.Settings.config.username_link) {
                _this.usernameLink = Cmint.Settings.config.username_link.replace(/\{\{\s*username\s*\}\}/g, username);
            } else {
                _this.usernameLink = '/' + username;
            }
        })

    }

})