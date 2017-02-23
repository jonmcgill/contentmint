var Components = Components || {},
    Fields = Fields || {},
    Process = Process || {},
    Menus = Menus || {},
    Templates = Templates || {}
    Data = Data || {};

var Bus = Bus || new Vue();

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

    return {
        contains: contains,
        debug: debug,
        jstr: jstr,
        jprs: jprs,
        copy: copy,
        stringToNumber: stringToNumber
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

    function getVueIndex(index, context) {
        var data;
        data = Util.copy(Cmint.app[index.shift()]);
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
        console.log(context);
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
        // return Util.jprs($('#AvailableComponents').text());
    }

    function tokenize(input, component) {
        var output = input;
        component._tokens.forEach(function(pair) {
            var token = Object.keys(pair)[0];
            var exp = new RegExp('\\{\\{\\s*'+token+'\\s*\\}\\}', 'g');
            var value, matches;
            // searches output first for the token value
            if (component._fields.output[pair[token]]) {
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
    template: '\
        <div class="Component" @click="showFields">\
            <component :is="config._name" :config="config"></component>\
        </div>',
    methods: {
        showFields: function() {
            this.$emit('showfields', this.config);
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
        this.config._index = Index.getDomIndex(this.$el);
        Util.debug('mounted "' + this.config._name + '" at ' + this.config._index);
        $('a').click(function(e) {
            e.preventDefault();
        })
    },
    updated: function() {
        this.config._index = Index.getDomIndex(this.$el);
        Util.debug('updated "' + this.config._name + '" at ' + this.config._index);
    }
})
Vue.component('context', {
    props: ['children'],
    template: '\
        <div class="Context">\
            <wrap v-for="child in children" :config="child"></wrap>\
            <div class="context-insert" v-if="childNum < 1">Drag components here</div>\
        \</div>',
    computed: {
        childNum: function() {
            return this.children.length;
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
        categories: []
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
        }
    },
    mounted: function() {
        var _this = this;
        _this.categories = _this.components.map(function(comp) {
            return comp._category;
        })
        _this.categories = _this.categories.filter(function(cat, i) {
            return _this.categories.indexOf(cat) === i;
        }).sort();
    }
})
Vue.component('sidebar', {
    props: ['user', 'name', 'components', 'fieldsComponent'],
    template: '\
        <aside id="Sidebar">\
            <div class="sidebar-top">\
                <span class="content-name">{{ name }}</span>\
                <div class="username">\
                    <i class="fa fa-user"></i>\
                    <a :href="\'/\' + user">{{ user }}</a>\
                </div>\
            </div>\
            <div class="sidebar-sub">\
                <categories :components="components"></categories>\
            </div>\
            <div class="sidebar-main">\
                <context id="Components" data-context-name="components" :children="componentList"></context>\
            </div>\
            <div class="sidebar-fields">\
                \
            </div>\
        </aside>',
    data: function() {return{
        componentList: this.components
    }},
    mounted: function() {
        var _this = this;
        this.$bus.$on('filteredCategories', function(filtered) {
            _this.componentList = filtered;
        })
    }
})
Cmint.createComponent({
    template: '\
        <a v-if="config._fields.output.link" :href="config._fields.output.link">\
            <img :src="config._fields.output.source" width="100%" \
                 :data-src="config._fields.output.source2" /></a>\
        <img v-else :src="config._fields.output.source" width="100%" \
                    :data-src="config._fields.output.source2" />',
    config: {
        _name: 'banner-image',
        _display: 'Banner Image',
        _category: 'Images',
        _tokens: [
            { 'URL': 'link' },
            { 'FOO': 'foo' },
            { 'SOURCE': 'source' }
        ],
        _fields: {
            output: {
                source: 'http://scoopit.co.nz/static/images/default/placeholder.gif',
                source2: '',
                foo: '',
                link: 'http://scoopit.co.nz/static/images/default/placeholder.gif'
            },
            list: [
                {   name: 'link-mailto',
                    result: 'link'    },
                {   name: 'image-choice',
                    result: 'source'    }
            ]
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
    template: '<h3 class="thing" v-text="config._index + \' (\'+_uid+\')\'" :style="config.css"></h3>',
    config: {
        _name: 'thing',
        _display: 'Thing',
        _category: 'Content',
    }
})
Cmint.createProcess('mailto', function(inputs, component) {

    var output = 'mailto:';

    output += Cmint.tokenize(inputs.to.value, component) + '?';
    output += encode(Cmint.tokenize(inputs.subject.value, component)) + '&';
    output += encode(Cmint.tokenize(inputs.body.value, component));

    function encode(val) { return encodeURIComponent(val); }

    return output;

})
Cmint.createProcess('test', function(input) {
    return input + '?param=true';
})
Cmint.createMenu('image-list', {
    'Default': 'http://scoopit.co.nz/static/images/default/placeholder.gif',
    'Random': 'https://unsplash.it/800/300'
})
Cmint.createField({
    name: 'image-choice',
    config: {
        type: 'field-choice',
        display: 'Image Input Type',
        label: 'Select an image input type (field-choice)',
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
        label: 'Select an image (field-dropdown)',
        input: 'selected-image',
        menu: 'image-list'
    }
})
Cmint.createField({
    name: 'image-source',
    config: {
        type: 'field-text',
        display: 'Image URL',
        label: 'Write in an image URL (field-text)',
        input: 'url',
        help: 'Absolute path including http(s)://',
        check: /^https*:\/\/.+(\.[a-zA-Z]+)$/g,
        hook: 'test'
    }
})
Cmint.createField({
    name: 'link-mailto',
    config: {
        type: 'field-group',
        display: 'Email Link',
        hook: 'mailto',
        label: 'Fill in the fields for your email link (field-group)',
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
Cmint.createTemplate('test-template', [
    'thing', 'container', 'banner-image'   
])
Vue.component('field-text', {
    props: ['field', 'component'],
    template:'\
        <div class="field-instance">\
            <label>{{ field.label }}</label>\
            <input type="text" v-model="field.inputs[fields[field.name].input]" @input="process()" />\
            <div v-if="field.help" :style="check">{{ field.help }}</div>\
        </div>',
    data: function() { return {
        fields: Fields,
        pass: true
    }},
    computed: {
        check: function() {
            return this.pass ? {'color': '#aaa'} : {'color': 'red'}; 
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
        this.process();
    }

})
Vue.component('field-dropdown', {
    props: ['field', 'component'],
    template: '\
        <div class="field-instance">\
            <label>{{ field.label }}</label>\
            <div class="dropdown">\
                <button v-text="selected"></button>\
                <div class="dropdown-list">\
                    <button v-for="(item, key) in menu"\
                            v-text="key"\
                            @click="process(key)"></button>\
                </div>\
            </div>\
        </div>',
    data: function() { return {
        fields: Fields,
        menu: Menus[this.field.menu],
        selected: 'Default'
    }},
    methods: {
        process: function(selection) {
            var output = Menus[this.field.menu][selection];
            if (this.field.hook) {
                output = Process[this.field.hook](output);
            }
            this.field.inputs[this.fields[this.field.name].input] = selection;
            this.selected = selection;
            this.component._fields.output[this.field.result] = output;
        }
    },
    beforeMount: function() {
        this.selected = this.field.inputs[this.fields[this.field.name].input] || 'Default';
        this.process(this.selected);
    }
})
Vue.component('field-choice', {
    props: ['field', 'component'],
    template: '\
        <div class="field-instance">\
            <label>{{ field.label }}</label>\
            <div class="field-choice-wrap">\
                <span class="field-selected" v-text="selected"></span>\
                <div class="field-choices">\
                    <div v-for="choice in field.choices"\
                         v-text="displayName(choice)"\
                         @click="process(choice)"></div>\
                </div>\
            </div>\
            <div style="background:#eee;padding:0.5em" v-if="selected !== \'None\'">\
                <field :field="selectionData" :component="component"></field>\
            </div>\
        </div>',
    data: function() { return {
        fields: Fields,
        selected: this.field.selected || 'None',
        selectionData: this.field.selectionData || null,
        selectedFieldData: this.field.selectedFieldData || null
    }},
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
                    <input v-if="inp.type === \'input\'"\
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
        <div class="fields-container">\
            <div class="field-tokens" v-if="component._tokens">Available tokens: {{ tokens }}</div>\
            <field v-for="field in component._fields.list" :field="field" :component="component"></field>\
        </div>',
    computed: {
        tokens: function() {
            return this.component._tokens.map(function(pair) {
                return '{{'+ Object.keys(pair)[0] + '}}';
            }).join(', ');
        }
    }
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
    
    if (source === Drag.components) {
        Drag.draggedIndex = Index.getDomIndex(element);
        Drag.draggedData = Util.copy(Index.getVueIndex(Drag.draggedIndex));
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
        console.log(Cmint.app);
        var removeMe = Index.retrieveVueContext(Drag.draggedIndex, Cmint.app);
        Util.debug('removed component from stage at ' + removeMe.context[removeMe.key]._index);
        removeMe.context.splice(removeMe.key, 1);
        Vue.nextTick(Cmint.app.refresh);
        Vue.nextTick(Cmint.app.snapshot);
    }

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
Cmint.save = function() {
    this.saved = Util.copy(this.stage);
    Util.debug('saved content');
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
        
        var stage = '<context id="Stage" data-context-name="stage" :children="stage"></context>';
        Data.markup = markup.replace(/\{\{\s*stage\s*\}\}/, stage);
        $('#Template').html(Data.markup);

        Cmint.app = new Vue({

            el: '#App',

            data: {
                components: Cmint.setAvailableComponents(Templates[Data.template]),
                stage: [],
                saved: Data.saved,

                username: Data.username,
                contentName: Data.contentName,

                fieldsComponent: null,
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
                Util.debug('mounted app');
            }

        })

    })

})