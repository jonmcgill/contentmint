//
//  src/js/component-dropdown.js
//

var menus = {

    'images': {
        'Default': 'http://scoopit.co.nz/static/images/default/placeholder.gif',
        'Keyboard': 'http://www.imakenews.com/rbm/sed_keyboard.jpg',
    }

}

Vue.component('dropdown', {

    props: ['config', 'field'],

    data: function() { return { 
        menus: menus,
        down: false
    } },

    template: '\
        <div class="menu-dropdown">\
            <div class="menu-selected" @click="toggle">\
                <span v-html="field.type.selected"></span><i :class="iconClasses"></i>\
            </div>\
            <ul v-show="down">\
                <li v-for="(value, key) in menus[field.type.menu]" \
                    v-html="key" \
                    @click="selected(key)"></li>\
            </ul>\
        </div>\
    ',

    computed: {
        iconClasses: function() {
            return { 
                'fa': true, 
                'fa-chevron-down': this.down, 
                'fa-chevron-left': !this.down,
                'active': this.down
            }
        }
    },

    methods: {
        checkDefault: function(txt) {
            return txt === 'DEFAULT' ? '&nbsp;' : txt;
        },
        selected: function(item) {
            var menu = this.menus[this.field.type.menu];
            var prop = this.field.result;
            this.field.type.selected = item;
            this.config.settings[prop] = menu[item];
            this.toggle();
            setComponentJSON(this.$el, menu[item], this.field.result);
        },
        toggle: function() {
            return this.down = !this.down;
        }
    }


})