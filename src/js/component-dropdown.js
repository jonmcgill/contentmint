//
//  src/js/component-dropdown.js
//

var menus = {

    'images': {
        'Default': 'http://scoopit.co.nz/static/images/default/placeholder.gif',
        'Keyboard': 'http://www.imakenews.com/rbm/sed_keyboard.jpg',
    },

    'link-types': {
        'None': '',
        'URL': 'link-url',
        'Email Link': 'link-mailto',
        'Telephone': 'link-tel'
    }

}

Vue.component('dropdown', {

    props: ['config', 'field'],

    data: function() { return { 
        menus: menus,
        down: false,
        up: false
    } },

    template: '\
        <div class="menu-dropdown">\
            <div class="menu-selected" @click="toggle">\
                <span v-html="field.type.selected"></span><i :class="iconClasses"></i>\
            </div>\
            <ul v-show="down || up">\
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
                'fa-chevron-up': this.up,
                'fa-chevron-left': (!this.down && !this.up),
                'active': (this.down || this.up)
            }
        }
    },

    methods: {

        listPos: function() {
            var offset = $(this.$el).offset().top;
            var windowHeight = $(window).height();
            var docScroll = $(document).scrollTop();
            var expandUp = (offset - docScroll) > windowHeight / 2;
            if (expandUp) {
                $(this.$el).addClass('expand-up');
            } else {
                $(this.$el).removeClass('expand-up');
            }
        },

        checkDefault: function(txt) {
            return txt === 'DEFAULT' ? '&nbsp;' : txt;
        },

        selected: function(item) {
            this.toggle();
            var menu = this.menus[this.field.type.menu];
            var prop = this.field.result;
            var prevItem = this.field.type.selected;
            var component = getParentDOMComponent(this.$el);
            this.field.type.selected = item;

            if (this.field.fieldchoice) {
                var fieldPos = this.getFieldPosition() + 1;
                if (prevItem !== 'None' && prevItem !== item) {
                    this.config.fields.splice(fieldPos, 1);
                }
                if (prevItem !== item) {
                    this.config.settings[prop] = '';
                    this.addFieldChoice();
                }
            } else {
                this.config.settings[prop] = menu[item];
                setComponentJSON(this.$el, menu[item], this.field.result);
            }
        },

        addFieldChoice: function() {
            var component = getParentDOMComponent(this.$el);
            var fieldList = this.config.fields;
            var fieldPos = this.getFieldPosition() + 1;
            var menu = this.menus[this.field.type.menu];
            if (this.field.type.selected !== 'None') {
                fieldList.splice(fieldPos, 0, menu[this.field.type.selected]);
            }
            dataToDOMJSON(this.config, component);
        },

        getFieldPosition: function() {
            return $('.field-instance')
                .toArray()
                .indexOf(this.$parent.$el);
        },

        toggle: function() {
            this.down = !this.down;
            this.listPos();
        }
    },

    mounted: function() {
        if (this.field.fieldchoice) {
            this.addFieldChoice();
        }
    }

})