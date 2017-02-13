//
//  src/js/global.js
//
var g = {
    debug: true,
    attr: {
        contextName: '[data-context-name]',
        editor: '[data-editor]'
    },
    class: {
        component: '.Component',
        context: '.Context',
        hovered: '.hovered'
    },
    editors: {
        plain: 'undo redo bold italic',
        basic: 'undo redo bold italic alignleft aligncenter link',
        robust: 'undo redo bold italic alignleft aligncenter link bullist numlist'
    },
    id: {
        app: '#App',
        editorToolbar: '#EditorToolbar',
        loading: '#Loading',
        stage: '#Stage',
        thumbnails: '#Thumbnails',
        trash: '#Trash'
    },
    name: {
        config: 'data-config',
        context: 'Context',
        contextEmpty: 'Context-Empty',
        contextName: 'data-context-name',
        editor: 'data-editor',
        editorID: 'data-editor-id',
        editorPlain: 'plain',
        editorBasic: 'basic',
        editorRobust: 'robust',
        hovered: 'hovered',
        prop: 'data-prop',
        thumbnail: 'thumbnail'
    }
}
//
//  src/js/effects.js
//
var effects = {

    mailto: function(component, result, json) {

        var config = json ? getComponentJSON(component.$el) : component.config;
        var settings = config.settings;
        var output = 'mailto:';

        settings.to = settings.to || '';
        settings.subject = settings.subject || '';
        settings.body = settings.body || '';

        output += settings.to + '?';
        output += 'Subject=' + encodeURIComponent(effects.tokenize(component, settings.subject, json)) + '&';
        output += 'Body=' + encodeURIComponent(effects.tokenize(component, settings.body, json));
        output = effects.tokenize(component, output, json);

        settings[result] = output;

        return output;

    },

    telLink: function(component, result, json) {

        var config = json ? getComponentJSON(component.$el) : component.config;
        var settings = config.settings;
        var output;

        settings.number = settings.number || '';

        if (settings.number) {
            output = 'tel:' + effects.tokenize(component, settings.number, json);
        }

        settings[result] = output;

        return output;

    },

    tokenize: function(component, value, json) {

        if (component.config.tokens) {
            component.config.tokens.forEach(function(token) {
                var config = json ? getComponentJSON(component.$el) : component.config;
                var data = config[token[1]] || config.settings[token[1]];
                var clean = data.replace(/<.+?>/g, '');
                var exp = new RegExp('\\{\\{\\s*'+token[0]+'\\s*\\}\\}', 'g');
                value = value.replace(exp, clean);
            })
        }
        return value;
    }

}
//
//  src/js/fieldData.js
//
var fieldData = {
    'image-dropdown': {
        label: 'Select a preset image',
        result: 'src',
        type: {
            name: 'dropdown',
            menu: 'images',
            selected: 'Default'
        }
    },
    'image-url': {
        label: 'Write in an image URL',
        result: 'src',
        type: { name: 'text' }
    },
    'alt-text': {
        label: 'Add image alt text',
        result: 'alt',
        type: { name: 'text' }
    },
    'link-mailto': {
        result: 'href',
        type: {
            name: 'fieldgroup',
            effect: 'mailto',
            fields: [
                {   type: { name: 'text' },
                    result: 'to',
                    label: 'Email address(s) to send to' },
                {   type: { name: 'text' },
                    result: 'subject',
                    label: 'Subject line' },
                {   type: { name: 'textarea' },
                    result: 'body',
                    label: 'Email body text' }
            ]
        }
    },
    'link-url': {
        label: 'Link URL',
        result: 'href',
        type: { name: 'text' }
    },
    'link-tel': {
        result: 'href',
        type: {
            name: 'fieldgroup',
            effect: 'telLink',
            fields: [
                {   type: { name: 'text' },
                    result: 'number',
                    label: 'Enter telephone number'
                }
            ]
        }
    },
    'link-choice': {
        label: 'Select a link type',
        fieldchoice: true,
        result: 'href',
        type: {
            name: 'dropdown',
            menu: 'link-types',
            selected: 'None'
        }
    }

}
//
//  src/js/componentDefaults.js
//
var componentDefaults = {
    'two-column': {
        name: 'two-column',
        display: 'Two Columns',
        left: [
            {
                name: 'body-copy',
                display: 'Body Copy',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis feugiat aliquet tristique.'
            }
        ],
        right: [
            {
                name: 'body-copy',
                display: 'Body Copy',
                content: 'Fusce vitae eros metus. In mollis scelerisque lorem, at placerat sem porttitor a.'
            }
        ]
    },
    'body-copy': {
        name: 'body-copy',
        display: 'Body Copy',
        content: 'Change this content. You can add lists, links, and special characters. You can make text bold, italic, or even center aligned.'
    },
    'table-data': {
        name: 'table-data',
        display: 'Table Test',
        course: 'Course Name Goes Here',
        date: 'MM/DD/YYYY',
        componentTag: 'main',
        settings: {
            active: false,
            href: ''
        },
        tokens: [['Course', 'course'], ['Date', 'date']],
        fields: ['link-mailto']
    },
    'heading': {
        name: 'heading',
        display: 'Title',
        content: '<div style="font-family:Arial,sans-serif;font-size:2.4em;">Lorem Ipsum Titlum</div>'
    },
    'banner': {
        name: 'banner',
        display: 'Banner Image',
        settings: {
            active: false,
            src: 'http://scoopit.co.nz/static/images/default/placeholder.gif',
            alt: 'Default alt text',
            href: ''
        },
        fields: ['image-dropdown', 'image-url', 'alt-text', 'link-choice']
    }
}
//
//  src/js/component-wrapper.js
//
//  wrappers contain any given component. They handle the logic of the components.
//  wrappers take raw component data, call the component with the name and then
//  pass that data right on along to the generated component.
//  wrappers will also look for the settings property and delegate that off to
//  the <settings> component.
Vue.component('wrapper', {
    props: ['config'],
    template: '\
        <div class="Component">\
            <component :is="config.name" :config="config"></component>\
            <div class="comp-toolbar">\
                <button class="btn-toolbar" @click="copy"><i class="fa fa-clone"></i></button>\
                <button class="btn-toolbar" @click="trash"><i class="fa fa-trash-o"></i></button>\
                <button class="btn-toolbar" @click="openSettings" v-if="config.settings"><i class="fa fa-cog"></i></button>\
            </div>\
        </div>',
    methods: {

        trash: function() {
            $(this.$el).remove();
            syncStageAndStore();
            debug(checkSync);
        },

        copy: function() {
            var path = walk.up(this.$el);
            path[0].index++;
            var data = getComponentData(this.$el);
            walk.down(path.reverse(), data);
        },

        openSettings: function() {
            var _this = this;
            setSettingsProperty(this.$el, 'active', true);
            updateComponentData(this.$el);
            Vue.nextTick(function() {
                setTimeout(function() {
                    $('.field-widget').addClass('active');
                    _this.$root.fieldsOpen = true;
                }, 100);
            })
        }

    },
    mounted: function() {
        var _this = this;
        initStageComponent(this);
        initEditor(this);
        $(this.$el).find('a').click(function(e) {
            debug('prevent link clicks');
            e.preventDefault();
        })
        // if (this.config.componentTag) {
        //     swapContainerTag(this.$el, this.config.componentTag);
        // }
    },
    updated: function() {
        initStageComponent(this);
        initEditor(this);
        $(this.$el).find('a').click(function(e) {
            debug('prevent link clicks');
            e.preventDefault();
        })
        // if (this.config.componentTag) {
        //     swapContainerTag(this.$el, this.config.componentTag);
        // }
    }
})
//
//  src/js/component-context.js
//
//  context components do not have editable content. Rather, they
//  are additional wrappers around components that offer different
//  layout possibilities. Each context instance dynamically generates
//  wrapped components given the set of component data given
//  
//  Additionally, when mounted, the context component is added to the
//  dragula instance so it can receive other components
Vue.component('context', {
    props: ['components'],
    template: '\
        <div class="Context">\
            <wrapper v-for="config in components" :config="config"></wrapper>\
        </div>',
    mounted: function() {
        addContainer(this.$el);
    }
})
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
//
//  src/js/component-settings.js
//
Vue.component('field', {
    props: ['field', 'config'],
    template: '\
    <div class="field-instance">\
    \
        <div class="field-wrap" v-if="field.type.name === \'text\'">\
            <label>{{ field.label }}</label>\
            <input v-model="config.settings[field.result]" />\
        </div>\
    \
        <div class="field-wrap" v-if="field.type.name === \'textarea\'">\
            <label>{{ field.label }}</label>\
            <textarea v-model="config.settings[field.result]"></textarea>\
        </div>\
    \
        <div class="field-wrap" v-if="field.type.name === \'dropdown\'">\
            <label>{{ field.label }}</label>\
            <dropdown :field="field" :config="config"></dropdown>\
        </div>\
    \
        <div class="field-wrap" v-if="field.type.name === \'fieldgroup\'">\
            <fieldgroup :field="field" :fields="field.type.fields" :config="config"></fieldgroup>\
        </div>\
    \
    </div>',
    mounted: function() {
        var _this = this;
        var data = _this.config.settings;
        var result = _this.field.result;
        var effect = _this.field.effect;
        // Handles simple text input
        // Updates Vue data and json model on component
        if (this.field.type.name !== 'fieldgroup') {
            $(this.$el).find('input, textarea, .menu-selected').on('keyup click', function() {
                var value = $(this).val();
                if (result) {
                    setComponentJSON(this, value, result);
                }
            })
        }
    }
})
//
//  src/js/component-fieldgroup.js
//
Vue.component('fieldgroup', {

    props: ['field', 'fields', 'config'],

    template: '\
    <div class="field-group-field">\
        <field v-for="fld in fields" :field="fld" :config="config"></field>\
        <div class="field-tokens" v-if="config.tokens">\
            <p>\
                <strong>Available tokens: </strong><span v-html="displayTokens()"></span>\
            </p>\
        </div>\
    </div>',

    methods: {
        displayTokens: function() {
            if (this.config.tokens) {
                return this.config.tokens.map(function(token) {
                    return token[0]
                }).join(', ');
            }
        }
    },

    mounted: function() {
        var _this = this;
        effects[_this.field.type.effect](this, this.field.result);
        dataToDOMJSON(_this.config, getParentDOMComponent(_this.$el));
        $(this.$el)
            .find('input, textarea, .menu-selected')
            .on('keyup click', function() {
                effects[_this.field.type.effect](_this, _this.field.result);
                dataToDOMJSON(_this.config, getParentDOMComponent(_this.$el));
            })
    }

})
//
//  src/js/field-widget.js
//
Vue.component('field-widget', {

    props: ['config'],

    template: '\
        <div v-if="config.settings.active" class="field-widget">\
            <button class="field-btn-back" @click="closeSettings">\
                <i class="fa fa-chevron-left"></i>Components\
            </button>\
            <h2>Settings: {{ config.display }}</h2>\
            <field v-for="field in config.fields"\
                    :field="fieldData[field]"\
                    :config="config"></field>\
        </div>',

    data: function() {
        return {
            fieldData: fieldData
        }
    },

    methods: {

        closeSettings: function() {
            var _this = this;
            $(_this.$el).removeClass('active');
            setTimeout(function() {
                _this.config.settings.active = false;
                _this.$root.fieldsOpen = false;
                setSettingsProperty(_this.$el, 'active', false);
            }, 250)
        }

    }

})
//
//  src/js/component-heading.js
//
Vue.component('heading', {
    props: ['config'],
    template: '<div data-editor="basic" data-prop="content" v-html="config.content"></div>'
})
//
//  src/js/component-body-copy.js
//
//  Remember, all components are wrapped by the wrapper component. They must take a 'config'
//  prop passed from the wrapper.
Vue.component('body-copy', {
    props: ['config'],
    template: '<div :style="css" data-editor="robust" data-prop="content" v-html="config.content"></div>',
    data: function() {
        return {
            css: {
                'font-size': '1.2em',
                'font-family': 'Arial, sans-serif',
                'line-height': '1.7',
                'color': 'rgba(0,0,0,0.78)'
            }
        }
    }
})

Vue.component('table-data', {
    props: ['config'],
    template: '\
    <div class="Component-Container">\
        <table border="1" cellpadding="5" width="100%">\
            <thead>\
                <tr>\
                    <th width="33%" style="text-align:center;">Course Name</th>\
                    <th width="33%" style="text-align:center;">Date</th>\
                    <th width="33%" style="text-align:center;">Register</th>\
                </tr>\
            </thead>\
            <tbody>\
                <tr>\
                    <td style="text-align:center;" data-editor="basic" data-prop="course" v-html="config.course"></td>\
                    <td style="text-align:center;" data-editor="basic" data-prop="date" v-html="config.date"></td>\
                    <td style="text-align:center;"><a data-mailto :href="config.settings.href">Register!</a></td>\
                </tr>\
            </tbody>\
        </table>\
        <field-widget :config="config"></field-widget>\
    </div>\
    '
})
//
//  src/js/component-two-column.js
//
//  This is an example of a context component. Every context component
//  needs to identify its context regions with data-context-name.
//  The associated default configuration must have those names as keys
//  with arrays as values.
Vue.component('two-column', {
    props: ['config'],
    template: '\
        <div class="ColumnWrap">\
            <context :components="config.left" data-context-name="left"></context>\
            <context :components="config.right" data-context-name="right"></content>\
        </div>'
});
//
//  src/js/component-banner.js
//
Vue.component('banner', {
    props: ['config'],
    template: '\
    <div>\
        <a v-if="config.settings.href" :href="config.settings.href">\
            <img :src="config.settings.src" :alt="config.settings.alt" :style="css" />\
        </a>\
        <img v-else :src="config.settings.src" :alt="config.settings.alt" :style="css" />\
        <field-widget :config="config"></field-widget>\
    </div>\
    ',
    data: function() {
        return {
            css: {
                'width': '100%'
            }
        }
    }
})
//
//  src/js/main.js
//
var app = new Vue({
    el: '#App',
    data: {
        contentName: 'Content Name Goes Here',
        fieldsOpen: false,
        saved: '',
        stage: [],
        store: '[{"name":"heading","display":"Title","content":"<div style=\\"font-family: Arial,sans-serif; font-size: 2.4em;\\">TODO</div>"},{"name":"body-copy","display":"Body Copy","content":"<ul>\\n<li style=\\"margin-bottom: 1.2em;\\">Add ability to change component and context HTML tags</li>\\n<li style=\\"margin-bottom: 1.2em;\\">Add field and fieldgroup required indicators</li>\\n<li style=\\"margin-bottom: 1.2em;\\">Work with tinymce on pasting Word content</li>\\n<li style=\\"margin-bottom: 1.2em;\\">Work on preview view</li>\\n<li style=\\"margin-bottom: 1.2em;\\">Work on cleaning and prepping markup for emails</li>\\n<li style=\\"margin-bottom: 1.2em;\\">Work on template display</li>\\n</ul>"}]',
        thumbnails: [
            componentDefaults['heading'],
            componentDefaults['body-copy'],
            componentDefaults['table-data'],
            componentDefaults['two-column'],
            componentDefaults['banner']
        ],
        trash: [],
        username: 'mcgilljo'
    },
    methods: {
        save: function() {
            this.saved = JSON.stringify(getStageData());
        },
        collect: function() {
            this.store = JSON.stringify(getStageData());
        },
        refresh: function() {
            var _this = this;
            _this.empty();
            Vue.nextTick(function() {
                _this.stage = JSON.parse(_this.store);
            })
        },
        empty: function() {
            this.stage = [];
            $(g.id.stage).empty();
        },
        load: function() {
            var _this = this;
            _this.empty();
            Vue.nextTick(function() {
                _this.stage = JSON.parse(_this.saved);
            })
        }
    },
    mounted: function() {
        var _this = this;
        $(g.id.loading).remove();
        fireDocumentHandlers();
        $('.thumbnail').on('mouseenter mouseleave', function() {
            $(this).toggleClass('hovered');
        })
        if (this.store) this.refresh();
    }
})
//
//  src/js/nodes.js
//
g['$'] = {
    app: $(g.id.app),
    stage: $(g.id.stage),
    thumbnails: $(g.id.thumbnails),
    trash: $(g.id.trash)
}

g.node = {
    app: g.$.app[0],
    stage: g.$.stage[0],
    thumbnails: g.$.thumbnails[0],
    trash: g.$.trash[0]
}
//
//  src/js/documentHandlers.js
//
function fireDocumentHandlers() {

    $(document).on({
        'click': function(e) {

            var comp = $(e.target).closest('.Component');
            var stage = $(e.target).closest('#Stage');

            if (comp.length > 0 && stage.length > 0 && !app.fieldsOpen) {
                $('.Component.active').removeClass('active');
                comp.addClass('active');
                debug('active comp');

            } else {
                $('.Component.active').removeClass('active');
            }
        }
    })

}
//
//  src/js/walk.js
//
var walk = {
    up: function(el, selector) {
        var path = [];
        function travel(elem) {
            var nextContext = $(elem).closest('.Context')[0];
            var index = getIndex(nextContext, elem);
            var name = $(nextContext).attr('data-context-name');
            path.push({index: index, name: name});
            if ($(nextContext).attr('id') !== 'Stage') {
                travel($(nextContext).closest('.Component')[0])
            }
        }
        travel(el);
        return path;
    },

    down: function(path, obj, remove) {
        var item = app;
        var remove = remove || 0;
        path.forEach(function(data, i) {
            if (i === path.length - 1) {
                item[data.name].splice(data.index, remove, obj);
            } else {
                item = item[data.name][data.index];
            }
        })
        return;
    }
}
//
//  src/js/util.js
//
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


function genID(num) {
    var id = 'ID-', i = 1;
    while (i <= num) {
        if (i % 2 === 0) {
            id += String.fromCharCode(random(65, 90));
        } else {
            id += String.fromCharCode(random(48, 57));
        }
        i++;
    }
    return id;
}


function debug(output) {
    if (g.debug) {
        if (typeof(output) === 'string') {
            console.log('DEBUG: ' + output);
        } else if (typeof(output) === 'object') {
            console.log(output);
        } else if (typeof(output) === 'function') {
            output();
        }
    }
}


function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}


function getIndex(area, item) {
    var index;
    $(area).children().each(function(i) {
        if (this === item) {
            index = i;
            return false;
        }
    })
    return index;
}


function contains(a, b){
  return a.contains ?
    a != b && a.contains(b) :
    !!(a.compareDocumentPosition(b) & 16);
}


function log(thing) {
    console.log(thing);
}



function setComponentJSON(elem, value, result) {
    var $comp = $(elem).closest('.Component');
    data = JSON.parse($comp.attr(g.name.config));
    data.settings[result] = value;
    $comp.attr(g.name.config, JSON.stringify(data));
}


function updateComponentData(elem) {
    var path = walk.up(elem);
    var data = getComponentJSON(elem);
    walk.down(path.reverse(), getComponentJSON(elem), 1);
}

function getComponentJSON(elem) {
    return JSON.parse($(getParentDOMComponent(elem)).attr('data-config'));
}

function dataToDOMJSON(data, elem) {
    $(elem).attr(g.name.config, JSON.stringify(data));
}

function getParentDOMComponent(elem) {
    var found = $(elem).closest(g.class.component);
    if (found.length) {
        return found[0];
    }
}

function setSettingsProperty(elem, prop, value) {
    var $comp = $(elem).closest('.Component');
    var data = JSON.parse($comp.attr(g.name.config));
    data.settings[prop] = value;
    $comp.attr(g.name.config, JSON.stringify(data));
}

function setComponentProperty(elem, prop, value) {
    var $comp = $(elem).closest('.Component');
    var data = JSON.parse($comp.attr(g.name.config));
    data[prop] = value;
    $comp.attr(g.name.config, JSON.stringify(data));
}

function getComponentProperty(elem, prop) {
    var $comp = $(elem).closest('.Component');
    return JSON.parse($comp.attr(g.name.config))[prop];
}

function swapContainerTag(container, newTag) {
    var attributes = $(container)[0].attributes;
    var newContainer = $('<'+newTag+'></'+newTag+'>');
    for (var i = 0; i < attributes.length; i++) {
        $(newContainer).attr(attributes[i].name, $(container).attr(attributes[i].name))
    }
    $(container).wrapInner(newContainer);
    $(container).children().first().unwrap();
    return newContainer[0];
}


function hoverIndication(elem) {
    $(elem).on('mouseenter', function(e) {
        var t = $(e.target);
        if (t.hasClass('Component') || t.hasClass('Context')) {
            t.addClass(g.name.hovered);
            var parent = t.parents('.hovered');
            if (parent[0] && parent[0] !== e.target) {
                parent.addClass('hovered-nested');
            }
        }
    }).on('mouseleave', function(e) {
        var t = $(e.target);
        if (t.hasClass('hovered-nested')) {
            if (t.parents('.hovered').length === 0) {
                t.removeClass('hovered hovered-nested')
            }
        } else if (t.hasClass('hovered')) {
            if (t.parents('.hovered').length > 0) {
                t.parents('.hovered').first().removeClass('hovered-nested');
            }
            t.removeClass('hovered');
        }
    })
}

function setThumbnailHeight() {
    $('.thumbnail').each(function() {
        var compHeight = $(this).find('.thumbnail-component').height();
        $(this).css({ height: $(this).height() / 2 + 30 });
    })
}
$(window).on('load', function() {
    setThumbnailHeight();
})
//
//  src/js/collectData.js
//
//  Walks the stage DOM elements and assembles json
//  from the data-config elements and their children.
function collectData(elem, data) {
    var data = data || [];
    var elem = elem || g.node.stage;
    var children = $(elem).children();
    if (children.length) {
        children.each(function() {
            var child = this;
            var comp = JSON.parse($(child).attr(g.name.config));
            var contexts = $(child)
                .find(g.attr.contextName)
                .toArray()
                .filter(function(l) {
                    return $(l).closest(g.class.component)[0] === child;
                })
            if (contexts.length) {
                contexts.forEach(function(context) {
                    comp[$(context).attr(g.name.contextName)] = collectData(context);
                })
            }
            data.push(comp);
        })
    }
    return data;
}

function getComponentData(elem) {
    var $elem = $(elem);
    var data = JSON.parse($elem.attr('data-config'));
    var contextAreas = $elem.find('.Context')
        .toArray()
        .filter(function(context) {
            return $(context).closest('.Component')[0] === elem;
        })
    contextAreas.forEach(function(context) {
        var contextName = $(context).attr('data-context-name');
        $(context).children().each(function() {
            data[contextName].push(getComponentData(this));
        })
    })
    return data;
}

function getStageData() {
    return $('#Stage')
        .children()
        .toArray()
        .map(getComponentData);
}
//
//  src/js/dom-data-sync.js
//
function checkSync() {
    setTimeout(function() {
        console.log('Synced: ' + (JSON.stringify(collectData()) === JSON.stringify(app.stage)));
    }, 500);
    
}
function syncStageAndStore() {
    app.collect();
    Vue.nextTick(function() {
        app.refresh();
    })
}
//
//  src/js/initStageComponent.js
//
function initStageComponent(instance) {
    
    var element = instance.$el,
        componentData = copy(instance.config);

    var contextNames = $(element)
        .find(g.attr.contextName)
        .toArray()
        .filter(function(elem) {
            return $(elem).closest(g.class.component)[0] === element;
        })
        .map(function(elem) {
            return $(elem).attr(g.name.contextName);
        })

    contextNames.forEach(function(name) {
        componentData[name] = [];
    })

    $(element).attr(g.name.config, JSON.stringify(componentData));

}
//
//  src/js/initEditor.js
//
function globalEditorConfig() {
    return {
        inline: true,
        menubar: false,
        insert_toolbar: false,
        fixed_toolbar_container: g.id.editorToolbar,
        plugins: 'link lists paste textpattern autolink',
        forced_root_block: 'div',
        forced_root_block_attrs: {
            'style': 'margin-bottom: 1.2em;'
        }
    }
}


function initEditor(component) {
    var editorConfig = globalEditorConfig(),
        $component = $(component.$el);

    $component.find(g.attr.editor).each(function() {
        var editorElement = this,
            $editorElement = $(this),
            editorType = $editorElement.attr(g.name.editor),
            editorInitiated = $editorElement.attr(g.name.editorID),
            isThumbnail = $component.parent().hasClass(g.name.thumbnail);
        if (!editorInitiated && !isThumbnail) {
            switch(editorType) {
                case g.name.editorPlain:
                    editorConfig.toolbar = g.editors.plain;
                    break;
                 case g.name.editorBasic:
                    editorConfig.toolbar = g.editors.basic;
                    break;
                 case g.name.editorRobust:
                    editorConfig.toolbar = g.editors.robust;
                    break;
                default:
                    editorConfig.toolbar = g.editors.basic;
                    break; 
            }

            editorConfig.setup = function(editor) {
                editor.on('Change keyup', function() {
                    var componentData = JSON.parse($component.attr(g.name.config)),
                        componentProp = $editorElement.attr(g.name.prop);
                        
                    componentData[componentProp] = editor.getContent();
                    $component.attr(g.name.config, JSON.stringify(componentData));

                    // If component has fields and component has an effect, run that effect
                    // using the data stored in the component's data-config attribute
                    // when the editor instance is updated. We use the stored json here so that
                    // we don't fire Vue's rerendering on each update.
                    if (component.config.fields) {
                        component.config.fields.forEach(function(field) {
                            var fld = fieldData[field];
                            if (fld.type.effect) {
                                var output = effects[fld.type.effect](component, fld.result, true);
                                setSettingsProperty(editorElement, fld.result, output);
                                $component
                                    .find('[data-'+fld.type.effect+']')
                                    .attr(fld.result, output);
                            }
                        })
                    }
                })
            }

            var editorID = genID(10);
            $editorElement.attr(g.name.editorID, editorID)
            editorConfig.selector = '['+g.name.editorID+'="'+editorID+'"]';
            tinymce.init(editorConfig);

        }

    })

}
//
//  src/js/initDragula.js
//
var drake = dragula([g.node.thumbnails, g.node.stage, g.node.trash], {

    copy: function(el, source) {
        if (app.shiftdown && source === g.node.stage) {
            return true;
        } else {
            return source === g.node.thumbnails;
        } 
    },

    // Disable rearranging components on stage when field widget is open
    moves: function(el, source, handle, sibling) {
        return !app.fieldsOpen;
    },

    // http://jsfiddle.net/cfenzo/7chaomnz/ (for the contains bit)
    // Was getting child node error from dragula when moving nested containers
    accepts: function(el, target) {
        return target !== g.node.thumbnails && !contains(el, target);
    },

}).on('drop', function(el, target, source, sibling) {

    if (target === g.node.trash) {
        
        syncStageAndStore();
        debug('Component trashed');
        debug(checkSync);
        g.$.trash.empty();

    } else if (source === g.node.thumbnails && $(target).hasClass(g.name.context)) {
        
        var $el = $(el);
        var component = $el.find(g.class.component)[0];
        var index = getIndex($el.parent(), el);
        var dataPath = walk.up(el);

        $el.remove();
        walk.down(dataPath.reverse(), getComponentData(component));

        Vue.nextTick(function() {
            app.collect();
            debug(checkSync);
        })
    }
    if ((source === g.node.Stage || $(source).hasClass(g.name.context)) &&
        (target === g.node.Stage || $(target).hasClass(g.name.context))) {
        syncStageAndStore();
        debug(checkSync);
    }

}).on('over', function(el, container, source) {

    if (container === g.node.trash) {
        g.$.trash.addClass('trashing');
    } else {
        g.$.trash.removeClass('trashing');
    }

}).on('dragend', function(el, container, source) {

    g.$.trash.removeClass('trashing');

})

function addContainer(el) {
    if (!$(el).closest('.thumbnail').length && drake) {
        drake.containers.push(el);
    }
}