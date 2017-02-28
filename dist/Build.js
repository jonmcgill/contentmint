var Components = Components || {},
    Fields = Fields || {},
    Process = Process || {},
    Menus = Menus || {},
    Editor = Editor || {hooks:{}},
    Templates = Templates || {},
    Data = Data || {},
    Bus = Bus || new Vue();

Object.defineProperties(Vue.prototype, {
    $bus: {
        get: function() {
            return Bus;
        }
    }
})
var Util = (function() {
    
    function contains(a, b){
      return a.contains ?
        a != b && a.contains(b) :
        !!(a.compareDocumentPosition(b) & 16);
    }

    function debug(thing) {
        console.log('DEBUG: ' + thing);
    }

    function jstr(obj) {
        return JSON.stringify(obj);
    }

    function jprs(str) {
        return JSON.parse(str);
    }

    function copy(obj) {
        return jprs(jstr(obj));
    }

    function stringToNumber(string) {
        var convert = string * 1;
        return isNaN(convert) ? string : convert;
    }

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

    return {
        contains: contains,
        debug: debug,
        jstr: jstr,
        jprs: jprs,
        copy: copy,
        stringToNumber: stringToNumber,
        genId: genID
    }

})()
    
var Index = (function() {
    
    function getContainerIndex(child, parent) {
        var index = null;
        $(parent).children().each(function(i, l) {
            if (this === child) {
                index = i;
            }
        })
        return index;
    }

    function getDomIndex(elem, pathArray) {
        var name, index, path, context, parent;
        context = $(elem).closest('.Context');
        pathArray = pathArray || [];
        name = context.attr('data-context-name');
        index = getContainerIndex(elem, context);
        pathArray.unshift(index);
        pathArray.unshift(name);  
        parent = $(context).parent().closest('.Component');

        if (parent.length) {
            return pathArray = getDomIndex(parent[0], pathArray);
        } else {
            return pathArray;
        }
    }

    function getVueIndex(index, context, env) {
        var data;
        var env = env || Cmint.app;
        
        if (env === Cmint.componentList) {
            data = Util.copy(env);
            index.shift();
        } else {
            data = Util.copy(env[index.shift()]);
        }
        index.forEach(function(key, i) {
            if (context && (i === index.length - 1)) {
                data = {data: data, key: key};
            } else {
                data = data[key];
            }
        })
        Util.debug('got Vue index: ' + JSON.stringify(data));
        return data;
    }

    function retrieveVueContext(index, startContext) {
        var context = startContext,
            output;
        index.forEach(function(key, i) {
            if (i === index.length - 1) {
                output = { 
                    context: context, 
                    key: key
                };
            } else {
                context = context[key];
            }
        })
        return output;
    }

    function setVueIndex(index, data, newIndex) {
        var startContext, context, appContext, keyName, cut, newContext;
        startContext = Cmint.app[index[0]];
        context = Cmint.app[index.shift()];
        appContext = retrieveVueContext(index, context);
        if (!newIndex) {
            appContext.context.splice(appContext.key, 0, data);
        } else {
            newIndex.shift();
            newContext = retrieveVueContext(newIndex, startContext);
            var move = appContext.context.splice(appContext.key, 1)[0];
            newContext.context.splice(newContext.key, 0, move);
        }
    }

    return {
        getDomIndex: getDomIndex,
        getContainerIndex: getContainerIndex,
        getVueIndex: getVueIndex,
        retrieveVueContext: retrieveVueContext,
        setVueIndex: setVueIndex
    }

})()
var Cmint = (function() {
    
    function createComponent(options) {
        if (!options.template) throw 'Your component is missing a template';
        if (!options.config) throw 'You component is missing its config';
        if (Components[options.config._name]) {
            throw 'That component already exists';
        } else {
            if (!options.config._index) {
                options.config._index = '';
            }
            Components[options.config._name] = options.config;
            Vue.component(options.config._name, {
                props: ['config'],
                template: options.template
            })
        }
    }

    function createField(options) {
        if (!options.name) throw 'You must give all created fields a name';
        if (!options.config.type) throw 'You must give all created fields a field type';
        if (!options.config.label) throw 'You must give all created fields a label';
        if (!options.config.input) throw 'You must associate all created fields with an input';
        
        if (Fields[options.name]) {
            throw 'Field already exists';
        } else {
            Fields[options.name] = options.config;
        } 
    }

    function createProcess(name, fn) {
        if (Process[name]) {
            throw 'Process name already exists';
        } else {
            Process[name] = fn;
        }
    }

    function createMenu(name, items) {
        if (Menus[name]) {
            throw 'Menu name already exists';
        } else {
            Menus[name] = items;
        }
    }

    function createTemplate(name, components) {
        if (Templates[name]) {
            throw 'Template name already exists';
        } else {
            Templates[name] = components
        }
    }

    function setAvailableComponents(components) {
        return components.map(function(comp) {
            return Util.copy(Components[comp]);
        })
    }

    function tokenize(input, component) {
        var output = input;
        if (!component._tokens) return output;
        component._tokens.forEach(function(pair) {
            var token = Object.keys(pair)[0];
            var exp = new RegExp('\\{\\{\\s*'+token+'\\s*\\}\\}', 'g');
            var value, matches;
            // searches _content first for token
            if (component._content) {
                if (component._content[pair[token]]) {
                    value = component._content[pair[token]];
                    // get rid of html tags if present
                    value = value.replace(/<.+?>/g,'');
                }
            }
            // then search output for the token value
            else if (component._fields.output[pair[token]]) {
                value = component._fields.output[pair[token]];
            // then searches in the inputs
            } else {
                component._fields.list.forEach(function(field) {
                    if (field.inputs[pair[token]]) {
                        value = field.inputs[pair[token]];
                    }
                })
            }
            value = value || '';
            matches = output.match(exp);
            if (matches) {
                output = output.replace(exp, value);
                Util.debug('tokenizing: {{ ' + token + ' }} --> ' + value);
            }
        })
        return output;
    }

    return {
        createComponent: createComponent,
        createField: createField,
        createProcess: createProcess,
        createMenu: createMenu,
        createTemplate: createTemplate,
        setAvailableComponents: setAvailableComponents,
        tokenize: tokenize
    }

})()
Vue.component('wrap', {
    props: ['config'],
    render: function(make) {
        var tag = this.config._tag || 'div';
        return make(tag,
            {
                'class': {
                    'Component': true,
                    'Contextualized': this.contextualize
                }
            },
            [
                make(this.config._name, {props: {'config': this.config}})
            ]
        )
    },
    data: function(){return{
        environment: null,
    }},
    methods: {
        showFields: function() {
            this.$emit('showfields', this.config);
        }
    },
    computed: {
        contextualize: function() {
            return Cmint.app ? Cmint.app.contextualize : false
        }
    },
    created: function() {
        var _this = this;
        Util.debug('created component ' + _this.config._name);
        if (_this.config._tokens) {
            _this.$options.watch = {};
            _this.config._tokens.forEach(function(token) {
                var source = token[Object.keys(token)[0]];
                _this.$watch(
                    function() {
                        if (_this.config._fiels) {
                            return _this.config._fields.output[source]; 
                        }
                    },
                    function(newVal, oldVal) {
                        _this.$bus.$emit('outputUpdate', source);
                    }
                )
            })
        }
    },
    mounted: function() {
        var _this = this;
        this.environment = $(this.$el).closest('#Components').length ? 'components' : 'stage';
        this.config._index = Index.getDomIndex(this.$el);
        Cmint.actionBarHandler(this);
        Util.debug('mounted "' + this.config._name + '" at ' + this.config._index);
        $('a').click(function(e) {
            e.preventDefault();
        })
        Editor.runHook(this, 'editor');
        Editor.init(this);
    },
    updated: function() {
        var _this = this;
        this.$bus.$on('deconstruct', function() {
            _this.deconstruct = !_this.deconstruct;
        })
        this.environment = $(this.$el).closest('#Components').length ? 'components' : 'stage';
        this.config._index = Index.getDomIndex(this.$el);
        Cmint.actionBarHandler(this);
        Util.debug('updated "' + this.config._name + '" at ' + this.config._index);
        $('a').click(function(e) {
            e.preventDefault();
        })
        Editor.runHook(this, 'editor');
        Editor.init(this);
    }
})
Vue.component('context', {
    props: ['children', 'thumbnails', 'tag'],
    render: function(make) {
        var tag = this.tag || 'div';
        var output;
        if (this.thumbnails) {
            output = this.children.map(function(child) {
                return make('div', {'class': {'thumbnail': true}}, [
                    make('span', {'class': {'thumbnail-name': true}}, [child._display]),
                    make('div', {'class': {'thumbnail-component': true}}, [
                        make('div', {'class': {'thumbnail-scale-wrap': true}}, [
                            make('wrap', {props:{ 'config': child }})
                        ])
                    ])
                ])
            })
        } else {
            output = this.children.map(function(child) {
                return make('wrap', {
                    props: { 'config': child },
                    key: child.id
                })
            })
        }
        if (!this.children.length) {
            output = [make('div', {'class':{'context-insert':true}},['Drag components here'])]
        }
        return make(tag, {
            'class': {
                'Context': true
            }}, output)
    },
    computed: {
        childNum: function() {
            return this.children.length === 0;
        }
    },
    mounted: function() {
        var unwrap = $(this.$el).find('.unwrap');
        if (unwrap.children().length) {
            unwrap.children().unwrap();
        } else {
            // unwrap.remove();
        }
    }
})
Vue.component('categories', {
    props: ['components'],
    template: '\
        <div :class="container">\
            <button class="category-selected" @click="toggle = !toggle">\
                <span>{{ selected }}</span><i :class="chevron"></i></button>\
            <div class="category-list">\
                <button class="category-option"\
                    @click="select()">All</button>\
                <button class="category-option"\
                    v-for="cat in categories"\
                    @click="select(cat)"\
                    >{{ cat }}</button>\
            </div>\
        </div>',
    data: function(){return{
        toggle: false,
        selected: 'All',
        // categories: []
    }},
    methods: {
        select: function(item) {
            this.selected = item || 'All';
            this.toggle = false;
            var filtered = this.components;
            if (this.selected !== 'All') {
                filtered = this.components.filter(function(comp) {
                    return comp._category === item;
                })
            }
            this.$bus.$emit('filteredCategories', filtered);
        }
    },
    computed: {

        container: function() {
            return {
                'category-container': true,
                'active': this.toggle
            } 
        },
        chevron: function() {
            return {
                'fa': true,
                'fa-chevron-left': !this.toggle,
                'fa-chevron-down': this.toggle
            }
        },
        categories: function() {
            var categories = this.components.map(function(comp) {
                return comp._category;
            });
            return categories.filter(function(cat, i) {
                return categories.indexOf(cat) === i;
            }).sort();
        }
    },
    mounted: function() {
        var _this = this;
        this.$bus.$on('closeCategoryList', function() {
            _this.toggle = false;
        })
    }
})
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
    data: function() {return{
        componentList: this.components
    }},
    mounted: function() {
        Cmint.componentList = this.componentList;
        var _this = this;
        this.$bus.$on('filteredCategories', function(filtered) {
            _this.componentList = filtered;
            Cmint.componentList = _this.componentList;
        })
    }
})
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
    data: function(){return{
        top: '20px',
        left: '20px',
        display: 'block',
        isActive: false,
        noFields: true,
        newComp: false,
        focused: false
    }},
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
            var comp = Cmint.app.focusedComponent;
            var index = Index.retrieveVueContext(comp.config._index, Cmint.app);

            index.context.splice(index.key, 1);

            Vue.nextTick(Cmint.app.refresh);
            Vue.nextTick(Drag.updateContainers);
            Vue.nextTick(Cmint.app.snapshot);
            Cmint.app.save();

            this.$bus.$emit('closeActionBar');
            Util.debug('trashed ' + comp.config._name + '[' + comp.config._index + ']');
        },
        copyComponent: function() {
            var comp = Cmint.app.focusedComponent;
            var index = Index.retrieveVueContext(comp.config._index, Cmint.app);
            var clone = Util.copy(index.context[index.key])

            index.context.splice(index.key + 1, 0, clone);

            Vue.nextTick(Cmint.app.refresh);
            Vue.nextTick(Drag.updateContainers);
            Vue.nextTick(Cmint.app.snapshot);
            Cmint.app.save();

            this.$bus.$emit('closeActionBar');
            Util.debug('copied ' + comp.config._name + '[' + comp.config._index + ']');
        },
        newComponent: function() {
            var comp = Cmint.app.focusedComponent;
            var index = Index.retrieveVueContext(comp.config._index, Cmint.app);
            var clone = Util.copy(index.context[index.key]);
            this.focused = clone;
            this.newComp = !this.newComp;
            // Cmint.saveCustomComponent('Test Custom Component', 'Custom', clone);
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
            _this.hasFields = component._fields;
            _this.display = 'block';
        })
        this.$bus.$on('openActionBar', function(component) {
            _this.noFields = component.config._fields === undefined;
            _this.isActive = true;
            Util.debug('component in focus: ' + this.hasFields);
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
Vue.component('overlay', {
    template: '<div id="Overlay"></div>',
    data: function() {return{
        isActive: false,
        isVisible: false
    }},
    mounted: function() {
        var _this = this;
        var $el = $(this.$el);
        this.$bus.$on('callComponentFields', function() {
            $el.addClass('active');
            setTimeout(function() {
                $el.addClass('visible');
            }, 20);
        })
        this.$bus.$on('closeFieldWidget', function() {
            $el.removeClass('visible');
            setTimeout(function() {
                $el.removeClass('active');
            }, 200);
        })
    }
})
Vue.component('toolbar', {
    props: ['changes', 'user', 'name'],
    template: '\
        <div id="Toolbar">\
            <button class="toolbar-code">\
                <i class="fa fa-code"></i>Get Code</button>\
            <button class="toolbar-save" @click="saveClick">\
                <i class="fa fa-save"></i>Save</button>\
            <button :class="{\'toolbar-context\': true, active: contextActive }"\
                @click="contextClick">\
                <i class="fa fa-object-ungroup"></i>Context</button>\
            <button class="toolbar-undo" @click="undoClick" v-if="changes">\
                <i class="fa fa-undo"></i>Undo</button>\
            <button class="toolbar-undo" @click="undoClick" v-else disabled>\
                <i class="fa fa-undo"></i>Undo</button>\
            <div id="EditorToolbar"></div>\
            <div class="right">\
                <span>{{ name }}</span><a :href="\'/\' + user">{{ user }}</a>\
            </div>\
        </div>',
    data: function(){return{
        contextActive: false
    }},
    methods: {
        undoClick: function() {
            Cmint.app.undo();
        },
        saveClick: function() {
            Cmint.app.save();
        },
        contextClick: function() {
            this.contextActive = !this.contextActive;
            Bus.$emit('contextualize');
            Util.debug('contextualized clicked');
        }
    }
})
Vue.component('custom-add', {
    props: ['component'],
    template: '\
        <div class="custom-add-wrap">\
            <span>Custom Component Information</span>\
            <input type="text" v-model="name" placeholder="Component name" />\
            <input type="text" v-model="category" placeholder="Component category" />\
            <button @click="addComponent">Save Component</button>\
            <div class="nameError" v-if="nameError">{{nameError}}</div>\
        </div>',
    data: function() {return{
        name: '',
        category: '',
        nameError: false
    }},
    methods: {
        addComponent: function() {
            var D = Cmint.app.Data;
            var double = false;
            var _this = this;
            if (!D.customComponents[D.template]) {
                D.customComponents[D.template] = [];
            }
            if (this.name === '') {
                this.nameError = 'Name field is blank';
                return;
            }
            Cmint.app.components.forEach(function(c) {
                if (c._display === _this.name + ' (Custom)') {
                    double = true;
                }
            })
            if (!double) {
                var comp = Util.copy(this.component);
                comp._display = this.name + ' (Custom)';
                comp._category = this.category || 'Custom';
                Cmint.app.components.push(comp);
                Util.debug('added "' + this.name + '" ('+this.category+') in template "'+D.template+'"');
                this.$bus.$emit('closeNewComp');
            } else {
                this.nameError = 'Name already exists';
                this.name = '';
            }
        }
    }
})
Cmint.createComponent({
    template: '\
        <a v-if="config._fields.output.link"\
            :href="config._fields.output.link"\
            target="_blank">\
            <img :src="config._fields.output.source" :style="config._css" \
                 :data-src="config._fields.output.source2" data-hook="vertical-space" /></a>\
        <img v-else :src="config._fields.output.source" :style="config._css" \
                 :data-src="config._fields.output.source2" data-hook="vertical-space" />',
    config: {
        _name: 'banner-image',
        _display: 'Banner Image',
        _category: 'Images',
        _css: {
            'width':'100%',
            'display': 'block',
            'margin':'0 auto'
        },
        _tokens: [
            { 'url': 'link' },
            { 'source': 'source' }
        ],
        _fields: {
            output: {
                source: 'http://placehold.it/800x300',
                link: ''
            },
            list: [
                {   name: 'link-choice',
                    result: 'link'      },
                {   name: 'image-choice',
                    result: 'source'    }
            ]
        }
    }
})
Cmint.createComponent({
    template: '<div data-edit="copy"\
                    data-hook="vertical-space"\
                    style="color:#231f20; font-family:Arial, sans-serif; font-size:16px; text-align:left; line-height: 24px;"></div>',
    config: {
        _name: 'body-copy',
        _display: 'Body Copy',
        _category: 'Content',
        _tag: 'article',
        _content: {
            copy: '<span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent non lectus id quam congue egestas. Pellentesque ullamcorper pretium tortor vitae vehicula. Vivamus lacinia porttitor libero. Nulla vulputate vel libero id blandit.</span>'
        },
        _css: {
            'line-height': '1.6'
        }
    }
})
Cmint.createComponent({
    template: '\
        <div class="Container">\
            <context :children="config.container" data-context-name="container"></context>\
        </div>',
    config: {
        _name: 'container',
        _display: 'Container',
        _category: 'Layout',
        container: []
    }
})
Cmint.createComponent({
    template: '\
        <table cellpadding="0" cellspacing="0"\
            :align="config._fields.output.alignment"\
            :width="config._fields.output.width"\
            style="background:#cb4f29;"\
            data-hook="vertical-space">\
            <tr>\
                <td width="20" height="16" style="font-size:10px; line-height:10px;">&nbsp;</td>\
                <td height="16" style="font-size:10px; line-height:10px;">&nbsp;</td>\
                <td width="20" height="16" style="font-size:10px; line-height:10px;">&nbsp;</td>\
            </tr>\
            <tr>\
                <td width="20" height="25" style="font-size:10px; line-height:10px;">&nbsp;</td>\
                <td height="25">\
                    <div style="font-family:Arial, sans-serif; font-size:16px; font-weight:bold; text-align:center; line-height:14px; font-style: italic;">\
                        <a :href="config._fields.output.link"\
                            target="_blank"\
                            style="color:#ffffff; text-decoration: none;"\
                            v-html="config._fields.output.text"></a>\
                    </div>\
                </td>\
                <td width="25" height="16" style="font-size:10px; line-height:10px;">&nbsp;</td>\
            </tr>\
            <tr>\
                <td width="20" height="16" style="font-size:10px; line-height:10px;">&nbsp;</td>\
                <td height="16" style="font-size:10px; line-height:10px;">&nbsp;</td>\
                <td width="20" height="16" style="font-size:10px; line-height:10px;">&nbsp;</td>\
            </tr>\
        </table>',
    config: {
        _name: 'cta-button',
        _display: 'Button',
        _category: 'CTA',
        _content: {
            linktext: 'CTA Message Here'
        },
        _fields: {
            list: [
                {   name: 'alignment',
                    result: 'alignment' },
                {   name: 'plain-text',
                    result: 'text' },
                {   name: 'width',
                    result: 'width' },
                {   name: 'link-choice',
                    result: 'link' }
            ],
            output: {
                'link': 'http://www.reyrey.com',
                'text': 'CTA Message Here',
                'alignment': 'center',
                'width': ''
            }
        }
    }
})
Cmint.createComponent({
    template: '<div data-edit="text"\
                    data-hook="vertical-space"\
                    style="font-size:23px; font-weight:bold; font-family:Arial; line-height:normal;"></div>',
    config: {
        _name: 'headline',
        _display: 'Headline',
        _category: 'Content',
        _content: {
            text: '<div>Update This Article Headline</div>'
        }
    }
})
Cmint.createComponent({
    template: '<h3 class="thing" v-text="config._index + \' (\'+_uid+\')\'" :style="config.css"></h3>',
    config: {
        _name: 'thing',
        _display: 'Thing',
        _category: 'Content',
    }
})
Cmint.createProcess('align', function(input, component, field) {

    return input;

})
Cmint.createProcess('mailto', function(inputs, component) {

    var output = 'mailto:';

    output += Cmint.tokenize(inputs.to.value, component) + '?';
    output += 'Subject=' + encode(Cmint.tokenize(inputs.subject.value, component)) + '&';
    output += 'Body=' + encode(Cmint.tokenize(inputs.body.value, component));

    function encode(val) { return encodeURIComponent(val); }

    return output;

})
Cmint.createProcess('test', function(input) {
    return input + '?param=true';
})
Editor.hooks['vertical-space'] = {
    
    editor: function(elements) {
        elements.each(function() {
            $(this).css({
                'margin-bottom': '24px'
            })
        });
    }

}
Cmint.createMenu('alignment', {
    'Default': 'center',
    'Center': 'center',
    'Left': ''
})
Cmint.createMenu('image-list', {
    'Default': 'http://scoopit.co.nz/static/images/default/placeholder.gif',
    'SED Keyboard': 'http://imakenews.com/rbm/sed_keyboard.jpg',
    'Random': 'http://placehold.it/800x300',
    'Cat': 'http://listhogs.com/wp-content/uploads/2016/06/10-14.jpg',
    'Norway': 'https://www.nordicvisitor.com/images/norway/sognefjord-norway.jpg',
    'The Grey': 'https://s-media-cache-ak0.pinimg.com/originals/b4/22/a1/b422a1816328a39b46e193c68df9e456.jpg',
    'YoYo': 'http://mediad.publicbroadcasting.net/p/michigan/files/styles/x_large/public/yoyo_ma_trumpie_12.jpg'
})
Cmint.createField({
    name: 'alignment',
    config: {
        type: 'field-dropdown',
        display: 'Alignment',
        label: 'Alignment',
        input: 'alignment',
        menu: 'alignment',
        hook: 'align'
    }
})
Cmint.createField({
    name: 'image-choice',
    config: {
        type: 'field-choice',
        display: 'Image Input Type',
        label: 'Image Input Type',
        input: 'selected-field',
        choices: [
            {   name: 'image-source',
                result: 'source'    },
            {   name: 'image-presets',
                result: 'source'   },
            {   name: 'image-choice',
                result: 'source'    }
        ]
    }
})
Cmint.createField({
    name: 'image-presets',
    config: {
        type: 'field-dropdown',
        display: 'Preset Images',
        label: 'Image List',
        input: 'selected-image',
        menu: 'image-list'
    }
})
Cmint.createField({
    name: 'image-source',
    config: {
        type: 'field-text',
        display: 'Image URL',
        label: 'Image URL Address',
        input: 'url',
        help: 'Absolute path including http(s)://',
        check: /^https*:\/\/.+(\.[a-zA-Z]+)$/g,
        hook: 'test'
    }
})
Cmint.createField({
    name: 'link-choice',
    config: {
        type: 'field-choice',
        display: 'Link Type',
        label: 'Link Type',
        input: 'selected-field',
        choices: [
            {   name: 'link-url',
                result: 'link'    },
            {   name: 'link-mailto',
                result: 'link'   }
        ]
    }
})
Cmint.createField({
    name: 'link-mailto',
    config: {
        type: 'field-group',
        display: 'Email Link',
        hook: 'mailto',
        label: 'Email Link',
        input: [
            { name: 'to', 
              label: 'The email sendee', 
              type: 'input' },

            { name: 'subject', 
              label: 'The email subject line', 
              type: 'input' },

            { name: 'body', 
              label: 'The body of your email', 
              type: 'textarea' }
        ],
    }
})
Cmint.createField({
    name: 'link-url',
    config: {
        type: 'field-text',
        display: 'Link URL',
        label: 'Link URL',
        input: 'link',
        help: 'Absolute path including http(s)://',
        check: /^https*:\/\/.+/g,
    }
})
Cmint.createField({
    name: 'plain-text',
    config: {
        type: 'field-text',
        display: 'Display Text',
        label: 'Display Text',
        input: 'text'
    }
})
Cmint.createField({
    name: 'width',
    config: {
        type: 'field-text',
        display: 'Width',
        label: 'Width',
        input: 'width',
        help: '1 - 550 (pixels)'
    }
})
Cmint.createTemplate('test-template', [
    'body-copy', 'banner-image', 'container'  
])

Cmint.createTemplate('reynolds-email', [
    'headline', 'body-copy', 'banner-image', 'container', 'cta-button'
])
Vue.component('field-text', {
    props: ['field', 'component'],
    template:'\
        <div class="field-instance">\
            <label>{{ field.label }}</label>\
            <div class="field-input-wrap">\
                <input type="text" v-model="field.inputs[fields[field.name].input]" @input="process()" />\
                <div class="field-help" v-if="field.help" :style="check">{{ field.help }}</div>\
            </div>\
        </div>',
    data: function() { return {
        fields: Fields,
        pass: true
    }},
    computed: {
        check: function() {
            return this.pass ? {'color': 'rgba(0,0,0,0.4)'} : {'color': '#E57373'};
        }
    },
    methods: {
        process: _.debounce(function() {
            var result = this.component._fields.output[this.field.result];
            var fieldData = Fields[this.field.name];
            var input = this.field.inputs[fieldData.input];
            if (this.component._tokens) {
                input = Cmint.tokenize(input, this.component);
            }
            if (this.field.check && input !== '') {
                this.pass = !!input.match(this.field.check);
                Util.debug('field passed - ' + this.pass);
            }
            if (this.field.hook) {
                input = Process[this.field.hook](input);
            }
            this.component._fields.output[this.field.result] = input;
        }, 500)
    },
    beforeMount: function() {
        Cmint.watchOutputUpdates(this);
    },
    mounted: function() {
        var _this = this;
        this.process();
        this.$bus.$on('fieldProcessing', function() {
            _this.process();
            Util.debug('processing ' + _this.field.name + ' after editor updates');
        });
    }

})
Vue.component('field-dropdown', {
    props: ['field', 'component'],
    template: '\
        <div class="field-instance">\
            <label>{{ field.label }}</label>\
            <div :class="{dropdown:true, active:toggle}">\
                <button @click="toggle = !toggle">\
                    <span>{{ selected }}</span><i :class="chevron"></i>\
                </button>\
                <div class="dropdown-list">\
                    <button v-for="(item, key) in menu"\
                            v-text="key"\
                            @click="process(key); toggle = !toggle"></button>\
                </div>\
            </div>\
        </div>',
    data: function() { return {
        fields: Fields,
        menu: Menus[this.field.menu],
        selected: 'Default',
        toggle: false
    }},
    computed: {
        chevron: function() {
            return {
                'fa': true, 'fa-chevron-left': !this.toggle, 'fa-chevron-down': this.toggle
            }
        }
    },
    methods: {
        dropdown: function() {
            
        },
        process: function(selection) {
            var output = Menus[this.field.menu][selection];
            if (this.field.hook) {
                output = Process[this.field.hook](output, this.component, this.field);
            }
            this.field.inputs[this.fields[this.field.name].input] = selection;
            this.selected = selection;
            this.component._fields.output[this.field.result] = output;
        }
    },
    beforeMount: function() {
        this.selected = this.field.inputs[this.fields[this.field.name].input] || 'Default';
        this.process(this.selected);
    },
    mounted: function() {
        var _this = this;
        _this.$bus.$on('closeDropdown', function() {
            _this.toggle = false;
        })
    }
})
Vue.component('field-choice', {
    props: ['field', 'component'],
    template: '\
        <div class="field-instance field-choice-container">\
            <label class="field-choice-label">{{ field.label }}</label>\
            <div :class="{\'field-choice-wrap\':true, active: toggle}">\
                <div class="field-selected" @click="toggle = !toggle">\
                    <span>{{ selected }}</span><i :class="chevron"></i>\
                </div>\
                <div class="field-choices">\
                    <div v-for="choice in field.choices"\
                         v-text="displayName(choice)"\
                         @click="process(choice)"></div>\
                </div>\
            </div>\
            <div class="field-selected-field-wrap" v-if="selected !== \'None\'">\
                <field :field="selectionData" :component="component"></field>\
            </div>\
        </div>',
    data: function() { return {
        toggle: false,
        fields: Fields,
        selected: this.field.selected || 'None',
        selectionData: this.field.selectionData || null,
        selectedFieldData: this.field.selectedFieldData || null
    }},
    computed: {
        chevron: function() {
            return {
                'fa': true,
                'fa-chevron-left': !this.toggle,
                'fa-chevron-down': this.toggle
            }
        }
    },
    methods: {
        displayName: function(choice) {
            if (choice === 'None') {
                return 'None';
            } else {
                return this.fields[choice.name].display;
            }
        },
        process: function(selection) {
            var _this = this;
            _this.toggle = false;
            _this.selectionData = null;
            _this.selectedFieldData = null;
            _this.selected = 'None';

            _this.field.selected = _this.selected;
            _this.field.selectionData = _this.selectionData;
            _this.field.selectedFieldData = _this.selectedFieldData;

            Vue.nextTick(function() {
                if (selection !== 'None') {
                    _this.selectionData = Util.copy(selection);
                    _this.selectedFieldData = _this.fields[_this.selectionData.name];
                    _this.selected = _this.selectedFieldData.display;

                    _this.field.selected = _this.selected;
                    _this.field.selectionData = _this.selectionData;
                    _this.field.selectedFieldData = _this.selectedFieldData;
                }
                Util.debug('field chosen: ' + _this.selected);
            })
        }
    },
    mounted: function() {
        var _this = this;
        this.$bus.$on('closeFieldChoice', function() {
            _this.toggle = false;
        })
    },
    beforeMount: function() {
        if (this.field.choices[0] !== 'None') {
            this.field.choices.splice(0, 0, 'None');
        }
    }
})
Vue.component('field-group', {
    props: ['field', 'component'],
    template: '\
        <div class="field-instance">\
            <label>{{ field.label }}</label>\
            <div class="field-group-wrap">\
                <div class="field-group-input" v-for="(inp, key) in field.inputs">\
                    <label>{{ firstUppercase(key) }}</label>\
                    <input type="text" v-if="inp.type === \'input\'"\
                        v-model="field.inputs[key].value"\
                        @keyup="process()"\
                        :placeholder="inp.label" />\
                    <textarea v-else-if="inp.type === \'textarea\'"\
                        v-model="field.inputs[key].value"\
                        @keyup="process()"\
                        :placeholder="inp.label"></textarea>\
                </div>\
            </div>\
        </div>',
    data: function() { return {
        fields: Fields
    }},
    methods: {
        process: function() {
            var _this = this;
            var output = Process[this.field.hook](this.field.inputs, this.component);
            this.component._fields.output[this.field.result] = output;
        },
        firstUppercase: function(txt) {
            return txt.charAt(0).toUpperCase() + txt.replace(/^./,'');
        }
    },
    beforeMount: function() {
        Cmint.watchOutputUpdates(this);
    },
    mounted: function() {
        var _this = this;
        this.$bus.$on('fieldProcessing', function() {
            _this.process();
            Util.debug('processing ' + _this.field.name + ' after editor updates');
        });
    }
})
Vue.component('field', {
    props: ['field', 'component'],
    template: '\
        <div class="field-wrap">\
            <component :is="field.type" :field="field" :component="component"></component>\
        </div>',
    beforeMount: function() {
        // result = default output listed in components
        var result = this.component._fields.output[this.field.result];

        // field instances aren't components; they're object literals passed to field components
        var fieldData = Fields[this.field.name];

        this.field.label = fieldData.label;
        this.field.type = fieldData.type;
        this.field.display = fieldData.display;
        this.field.menu = fieldData.menu || null;
        this.field.choices = fieldData.choices || null;
        this.field.help = fieldData.help || null;
        this.field.check = fieldData.check || null;
        this.field.hook = fieldData.hook || null;
        
        // if no inputs, this is the first instantiation of this field for a given component.
        // inputs are established based on the defaults provided to the fieldData and the components
        if (!this.field.inputs) {
            this.field.inputs = {};
            // If text input, make the input equal the default result
            if (this.field.type === 'field-text') {
                this.field.inputs[fieldData.input] = result;
            }
            // If dropdown, make the input equal 'Default' selection
            if (this.field.type === 'field-dropdown') {
                this.field.inputs[fieldData.input] = 'Default';
            }
            // If field group, cycle through and add to inputs
            if (this.field.type === 'field-group') {
                if (!this.field.hook) throw 'ERROR at '+this.field.name+': All field-group fields must have an associated hook';
                var inputs = this.field.inputs;
                fieldData.input.forEach(function(inp) {
                    inputs[inp.name] = { label: inp.label, type: inp.type, value: '' };
                })
            }
        }

    }
})
Vue.component('fields', {
    props: ['component'],
    template: '\
        <div :class="wrapClasses">\
            <div class="fields-top">\
                <button class="fields-close-btn" @click="close">\
                    <i class="fa fa-chevron-left"></i>Done\
                </button>\
                <div class="fields-header">{{ component._display }}</div>\
                <div class="field-tokens" v-if="component._tokens">\
                    <i class="fa fa-question-circle-o"></i>\
                    <span>Tokens: </span><span class="token-wrap" v-html="tokens"></span>\
                </div>\
            </div>\
            <div class="field-list">\
                <field v-for="field in component._fields.list" :field="field" :component="component" :key="field.id"></field>\
            </div>\
        </div>',
    data: function(){return {
        isActive: false
    }},
    computed: {
        wrapClasses: function() {
            return {
                'cmint': true,
                'fields-container': true,
                'active': this.isActive
            }
        },
        tokens: function() {
            return this.component._tokens.map(function(pair) {
                return '<span>{{ '+ Object.keys(pair)[0] + ' }}</span>';
            }).join(', ');
        }
    },
    methods: {
        open: function() {
            var _this = this;
            setTimeout(function() {
                _this.isActive = true;
            },50);
        },
        close: function() {
            var _this = this;
            setTimeout(function() {
                _this.isActive = false;
                _this.$bus.$emit('closeFieldWidget');
                setTimeout(function() {
                    Cmint.app.fieldsComponent = null;
                    Vue.nextTick(Cmint.app.snapshot);
                    Cmint.app.save();
                },200)
                Util.debug('closed field wiget');
            },50);
            
        }
    },
    mounted: function() {
        this.open();
        Util.debug('opened field wiget with ' + this.component._name)
    },
    // updated: function() {
    //     this.open();
    //     Util.debug('opened field wiget with ' + this.component._name)
    // }
})
var Drag = (function() {
    
    var drake;

    function init() {

        Drag.stage = $('#Stage')[0];
        Drag.components = $('#Components')[0];
        Drag.draggedIndex = null;
        Drag.draggedData = null;
        Drag.dragSpot = null;
        Drag.insertType = null;

        drake = dragula([Drag.stage, Drag.components], {
            copy: function(theCopy, source) {
                return source === Drag.components;
            },
            accepts: function(element, target, source, sibling) {
                return target !== Drag.components && !Util.contains(element, target);
            },
            removeOnSpill: true
        }).on('drag', Drag.onDrag)
          .on('drop', Drag.onDrop)
          .on('remove', Drag.onRemove);

    }

    function updateContainers() {
        $('#Stage .Context').each(function() {
            if (drake.containers.indexOf(this) <= -1) {
                drake.containers.push(this);
                Util.debug('added new container to drake instance');
            }
        })
    }

    function insertPlaceholder() {
        var placeholder = '<div class="PLACEHOLDER"><strong></strong></div>';
        if (Drag.insertType === 'prepend') {
            $(Drag.dragSpot).prepend(placeholder);
        } else if (Drag.insertType === 'after') {
            $(placeholder).insertAfter(Drag.dragSpot);
        }
    }

    return {
        drake: drake,
        init: init,
        insertPlaceholder: insertPlaceholder,
        updateContainers: updateContainers
    }

})()
Drag.onDrag = function(element, source) {
    
    Bus.$emit('closeActionBar');

    if (source === Drag.components) {
        Drag.draggedIndex = Index.getDomIndex(element);
        // Reference the componentList rather than app.stage because the user may
        // have filtered the categories
        Drag.draggedData = Util.copy(Index.getVueIndex(Drag.draggedIndex, null, Cmint.componentList));
        Util.debug('dragging from components at ' + Drag.draggedIndex);
    }

    if ($(source).closest('#Stage').length) {
        Drag.draggedIndex = Index.getDomIndex(element);
        if ($(element).prev().length === 0) {
            Drag.dragSpot = $(element).parent();
            Drag.insertType = 'prepend';
        } else {
            Drag.dragSpot = $(element).prev();
            Drag.insertType = 'after'
        }
        
        Util.debug('dragging from stage at ' + Drag.draggedIndex);
        Util.debug('insert type is "' + Drag.insertType + '"');
    }

}
Drag.onDrop = function(dropped, target, source, sibling) {
    
    var inContext, fromComponents, reordering, domIndex;
            
    toContext = $(target).closest('.Context').length > 0;
    fromComponents = source === Drag.components;
    reordering = $(source).closest('#Stage').length > 0;

    //  Once the component is dropped, we'll need to grab it's index and then
    //  immediately remove it from DOM. We add the copied data to the vm and then
    //  run a refresh.
    if (fromComponents && toContext) {

        domIndex = Index.getDomIndex(dropped);
        $(dropped).remove();
        Index.setVueIndex(domIndex, Drag.draggedData);
        Vue.nextTick(Cmint.app.refresh);
        Vue.nextTick(Drag.updateContainers);
        Vue.nextTick(Cmint.app.snapshot);
        Cmint.app.save();
        Util.debug('dropped new component in stage at ' + domIndex);

    }

    if (reordering) {

        //  We need the placeholder element to appear where the dragged item came from
        //  so that when we grab the location from the DOM it is an accurate data model.
        //  Once we have the index we can remove it immediately.
        var debugDelay = 0;

        Drag.insertPlaceholder();

        domIndex = Index.getDomIndex(dropped);

        Util.debug('dropped reordered component at ' + domIndex);

        // These timeouts are here so I can debug easier. It's helpful.
        setTimeout(function() {

            $('.PLACEHOLDER').replaceWith(dropped);
            Util.debug('removing placeholder')

            setTimeout(function() {
                //  Now we use the index from the DOM to retrieve the vm context arrays.
                //  Once we have those, we splice the dragged data into the drop context array.
                var dataToDrop = Index.retrieveVueContext(Drag.draggedIndex, Cmint.app);
                var dataDrop = Index.retrieveVueContext(domIndex, Cmint.app);
                if (dataDrop.context == dataToDrop.context) {
                    var drag_i = Drag.draggedIndex[Drag.draggedIndex.length - 1];
                    var drop_i = dataDrop.key;
                    if (drag_i < drop_i) {
                        dataDrop.key--;
                    }
                    Util.debug('reording in the same container');
                }
                dataDrop.context.splice(dataDrop.key, 0, dataToDrop.context.splice(dataToDrop.key, 1)[0]);
                Util.debug('splicing vm data')

                setTimeout(function() {
                    //  At this point, the data and the DOM should technically match, but we want to
                    //  do a refresh() so that all other DOM components are updated with their new
                    //  location. Lastly, we add any new context components to the dragula instance
                    Vue.nextTick(Cmint.app.refresh);
                    Vue.nextTick(Drag.updateContainers);
                    Vue.nextTick(Cmint.app.snapshot);
                    Cmint.app.save();
                    Util.debug('refreshing and updating containers')
                }, debugDelay)
            }, debugDelay)
        }, debugDelay)
    } // ends reordering

}
Drag.onRemove = function(element, container, source) {

    if ($(source).closest('#Stage').length) {

        Drag.insertPlaceholder();
        $('.PLACEHOLDER').replaceWith(element);
        $(element).removeClass('gu-hide');
        var removeMe = Index.retrieveVueContext(Drag.draggedIndex, Cmint.app);
        Util.debug('removed component from stage at ' + removeMe.context[removeMe.key]._index);
        removeMe.context.splice(removeMe.key, 1);
        Vue.nextTick(Cmint.app.refresh);
        Vue.nextTick(Cmint.app.snapshot);
    }

}
Editor.config = {
    inline: true,
    menubar: false,
    insert_toolbar: false,
    fixed_toolbar_container: '#EditorToolbar',
    plugins: 'link lists paste textpattern autolink charmap',
    toolbar: 'undo redo bold italic alignleft aligncenter link bullist numlist superscript charmap',
    forced_root_block: 'div'
}

Editor.init = function(component) {

    if (!component.config._content) return;

    $(component.$el).find('[data-edit]').each(function() {

        var config = Util.copy(Editor.config);
        var id = Util.genId(10);
        var contentProp = $(this).attr('data-edit');

        $(this).html(component.config._content[contentProp]);
        
        if (component.environment === 'components') return false;

        $(this).attr('data-editor-id', id);
        config.selector = '[data-editor-id="'+id+'"]';
        
        var STASH;

        config.init_instance_callback = function(editor) {
            STASH = editor.getContent();
        }

        config.setup = function(editor) {
            editor.on('Change keyup', _.debounce(function() {
                if (component) {
                    component.config._content[contentProp] = editor.getContent();
                    Bus.$emit('fieldProcessing');
                    Util.debug('updated content "'+contentProp+'" for ' + component.config._name);
                }
            }));
            editor.on('focus', function() {
                STASH = editor.getContent();
            });
            editor.on('blur', function() {
                if (!component.config._content) return;
                if (component.config._content[contentProp] !== STASH) {
                    Cmint.app.save();
                    Cmint.app.snapshot();
                }
            })
        }

        tinymce.init(config);
        $(this).removeAttr('data-editor-id');

    })

}
Cmint.actionBarHandler = function(component) {
    if (component.environment === 'components') return;
    var element = component.$el;
    var $el = $(element);
    $el.unbind();
    $el.click(function(e) {
        var nearestComponent = $(e.target).closest('.Component');
        if (nearestComponent[0] === element && !nearestComponent.hasClass('active')) {

            Cmint.app.focusedComponent = component;

            setTimeout(function() {
                var offset = $el.offset();
                var output = {};
                output.top = offset.top + 'px';
                output.left = offset.left + 'px';
                output.handle = offset.left + $el.width() + 'px';

                if($('#ActionBar.active').length) {
                    Bus.$emit('closeActionBar');
                    setTimeout(function() {
                        Bus.$emit('getComponentCoordinates', output, component);
                        setTimeout(function() {
                            Bus.$emit('openActionBar', component);
                        }, 100);                                        
                    },200)
                } else {
                    Bus.$emit('getComponentCoordinates', output, component);
                    setTimeout(function() {
                        Bus.$emit('openActionBar', component);
                    }, 100); 
                }
            }, 50);
        }
    })
}
Cmint.fireDocHandlers = function() {
    $(document).on({

        'click': function(e) {
            var $target = $(e.target);
            var isComponent = $target.closest('.Component').length;
            var isInStage = $target.closest('#Stage').length;
            var isActionBar = $target.closest('#ActionBar').length;
            var categoryList = $target.closest('.category-container').length;
            var fieldChoice = $target.closest('.field-choice-wrap').length;
            var dropdown = $target.closest('.dropdown').length;

            if (isComponent && isInStage) {
                var component = $target.closest('.Component');
                if (!component.hasClass('active')) {
                    $('.Component.active').removeClass('active');
                    component.addClass('active');
                }
            } else {
                $('.Component.active').removeClass('active');
                if (!isActionBar) {
                    Bus.$emit('closeActionBar');
                }
            }

            if (!categoryList) { Bus.$emit('closeCategoryList'); }

            if (!fieldChoice) { Bus.$emit('closeFieldChoice'); }

            if (!dropdown) { Bus.$emit('closeDropdown'); }

        }

    })
}
Cmint.load = function() {
    this.stage = Util.copy(this.saved);
    Vue.nextTick(Drag.updateContainers);
    Vue.nextTick(this.snapshot);
    Util.debug('loaded content');
}
Cmint.refresh = function() {
    this.stage = Util.copy(this.stage);
}
Editor.runHook = function(component, event) {

    var elements = $(component.$el).find('[data-hook]');

    $(component.$el).find('[data-hook]').each(function() {

        var hookName = $(this).attr('data-hook');
        var scoped = elements.filter(function() {
            return $(this).attr('data-hook') === hookName
        }).map(function() {
            return $(this).removeAttr('data-hook');
        })
        Editor.hooks[hookName][event](scoped);
        Util.debug('running component hook for ' + component.config._name);
    })

}
Cmint.save = function() {
    Bus.$emit('updateEditorData');
    this.saved = Util.copy(this.stage);
    
    var $notify = $('.notification');
    $notify.addClass('active');
    setTimeout(function() {
        $notify.removeClass('active');
    }, 2500);

    Util.debug('saved content');
}
Cmint.saveCustomComponent = function(name, category, data) {
    
    var D = Cmint.app.Data;

    if (!D.customComponents[D.template]) {
        D.customComponents[D.template] = [];
    }

    if (D.customComponents[D.template].indexOf(name) < 0) {
        var comp = Util.copy(data);
        comp._display = name;
        comp._category = category || 'Custom';
        Cmint.app.components.push(comp);
        Util.debug('added custom component: ' + name + ' ('+category+') for template "'+D.template+'"');
    } 

}
Cmint.showFields = function(component) {
    if (this.fieldsComponent) {
        this.fieldsComponent = null;
        Util.debug('closing field view for ' + component._name);
    } else {
        this.fieldsComponent = component;
        Util.debug('opening field view for ' + component._name);
    }
}
Cmint.snapshot = function() {
    this.changes++;
    var shot = Util.copy(this.stage);
    Util.debug('snapshot taken (current changes: ' + this.changes + ')');
    if (!this.previous) {
        this.previous = {
            snapshot: shot,
            prior: {
                snapshot: [],
                prior: null
            }
        }
    } else {
        this.previous = {
            snapshot: shot,
            prior: this.previous
        }
    }
}
Cmint.toJson = function(obj) {
    return JSON.stringify(obj, null, 2);
}
Cmint.undo = function() {
    if (this.previous) {
        this.changes--;
        this.stage = this.previous.prior.snapshot;
        Vue.nextTick(Drag.updateContainers);
        this.previous = this.previous.prior;
        if (!this.previous.prior) {
            this.previous = null;
        }
        Util.debug('state reverted (current changes: ' + this.changes + ')');
    } else {
        Util.debug('nothing to undo');
    }
}
Cmint.watchOutputUpdates = function(fieldComponent) {
    fieldComponent.$bus.$on('outputUpdate', function(output) {
        if (output !== fieldComponent.field.result) {
            fieldComponent.process();
        }
    })
}
$.getJSON('test/test-data.json', function(data) {

    Data = data;

    $.get('/templates/' + Data.template + '.html', function(markup) {
        
        var stage, templateComponents, customComponents = [];

        stage = '<context id="Stage" data-context-name="stage" :children="stage"></context>';
        Data.markup = markup.replace(/\{\{\s*stage\s*\}\}/, stage);
        $('#Template').html(Data.markup);

        if (Data.customComponents.hasOwnProperty(Data.template)) {
            customComponents = Util.copy(Data.customComponents[Data.template]);
        }

        templateComponents = Cmint.setAvailableComponents(Templates[Data.template]).concat(customComponents);
        

        Cmint.app = new Vue({

            el: '#App',

            data: {
                Data: Data,
                components: templateComponents,
                stage: [],
                saved: Data.saved,

                username: Data.username,
                contentName: Data.contentName,

                fieldsComponent: null,
                focusedComponent: null,
                contextualize: false,
                
                changes: null,
                previous: null,
            },

            methods: {
                showFields: Cmint.showFields,
                snapshot: Cmint.snapshot,
                undo: Cmint.undo,
                save: Cmint.save,
                load: Cmint.load,
                refresh: Cmint.refresh,
                toJson: Cmint.toJson
            },

            mounted: function() {

                Drag.init();

                Cmint.fireDocHandlers();

                var _this = this;
                this.$bus.$on('callComponentFields', function() {
                    _this.fieldsComponent = _this.focusedComponent.config;
                })
                this.$bus.$on('contextualize', function() {
                    _this.contextualize = !_this.contextualize;
                })

                Util.debug('mounted app');
                $('#Loading').remove();

            }

        })

    })

})