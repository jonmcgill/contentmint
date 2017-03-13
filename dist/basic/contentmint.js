var Cmint = Cmint || (function() {

    'use strict';

    return {

        // The main Vue instance
        App: null,

        // API methods for main vue instance
        AppFn: {},

        // Global event bus
        Bus: new Vue(),

        // Manages drag and drop with dragula.js
        Drag: {},

        // Manages WYSYWIG editing with TinyMCE
        Editor: {
            config: null,
            types: {}
        },

        // Manages running component hook functions
        Hooks: {},

        // API for field system
        Fields: {
            UIDS: {}
        },

        // Global settings and names
        Settings: {},

        // Stores Data and functionality defined in the 
        // project instance via the Cmint API.
        Instance: {
            Components: {},
            Data: null,
            Editor: {
                Config: null,
                PostProcesses: [],
                Types: {}
            },
            Fields: {
                List: {},
                Processes: {}
            },
            Hooks: {
                Local: {},
                Global: {}
            },
            Menus: {},
            Templates: {},
            Toolbar: []
        },

        // API that manages interaction between DOM and Vue instance data.
        // TinyMCE and dragula both manipulate the DOM directly so we need
        // a system in place that will counteract those actions and give
        // DOM control back over to the Vue data.
        Sync: {},

        // API for managing miscellaneous application features
        Ui: {
            Toolbar: [],
            Actionbar: [],
            componentList: null
        },

        // Helper functions
        Util: {}

    }

})();
Cmint.Settings = {

    config: {
        debug: true,
        tests: true,
        username: true,
        username_link: ''
    },

    name: {
        component: 'Component',
        context: 'Context',
        contextualize: 'Contextualized',
        dataHook: 'data-hook',
        dataContext: 'data-context',
        dataDisable: 'data-disable',
        dataEdit: 'data-edit',
        dataTemp: 'data-temp',
        placeholder: 'cmint-placeholder'
    },

    class: {
        component: '.Component',
        context: '.Context',
        categories: '.category-container',
        fieldchoice: '.field-choice-wrap',
        dropdown: '.dropdown',
        placeholder: '.cmint-placeholder',
        notification: '.cmint-notification'
    },

    id: {
        components: '#Components',
        stage: '#Stage',
        actionbar: '#ActionBar'
    },

    attr: {
        dataContext: '[data-context]',
        dataHook: '[data-hook]',
        dataDisable: '[data-disable]',
        dataEdit: '[data-edit]',
        dataTemp: '[data-temp]'
    }

}
// Assigns Bus to the Vue prototype and makes it available to all subsequent components
// https://devblog.digimondo.io/building-a-simple-eventbus-in-vue-js-64b70fb90834#.2s62ry2rp
Object.defineProperties(Vue.prototype, {
    $bus: {
        get: function() {
            return Cmint.Bus;
        }
    }
})
Cmint.Bus.setSelectedCategory = function(data) {

    Cmint.Bus.$on('selectedCategory', function(selection) {
        data.selectedCategory = selection;
        Cmint.Util.debug('selected the category "'+selection+'"');
    })

}
// Returns boolean if a (element) contains b (element). This is used in our
// dragging feature because dragula does not like it when you drag a component
// into itself.
Cmint.Util.contains = function(a, b) {
    return a.contains ?
        a != b && a.contains(b) :
        !!(a.compareDocumentPosition(b) & 16);
}
// Quick and dirty way to copy object literals
Cmint.Util.copyObject = function(obj) {
    return JSON.parse(JSON.stringify(obj));
}
// Allows us to log lots of stuff to the console for debugging purposes and then
// remove it all
Cmint.Util.debug = function(message) {
    if (Cmint.Settings.config.debug) {
        console.log('DEBUG: ' + message);
    }
}
Cmint.Util.random = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
Cmint.Util.Tests = [];

Cmint.Util.test = function(name, fn) {
    Cmint.Util.Tests.push({
        name: name,
        fn: fn
    })
}

Cmint.Util.formatTestResult = function(result) {
    if (typeof(result) === 'object') {
        return JSON.stringify(result);
    } else {
        return result;
    }
}

Cmint.Util.runTests = function() {
    if (Cmint.Settings.config.tests) {
        Cmint.Util.Tests.forEach(function(test) {
            var result = test.fn();
            if (result[0]) {
                console.log('TEST: ' + test.name + ' -- Passed');
            } else {
                var expected = Cmint.Util.formatTestResult(result[1]);
                var got = Cmint.Util.formatTestResult(result[2]);
                console.error('TEST: ' + test.name + ' -- Failed');
                console.error('=> expected ' + expected);
                console.error('=> returned ' + got);
            }
        })
    }
}
Cmint.Util.uid = function(length) {
    var id = 'ID-', i = 1;
    while (i <= length) {
        id += i % 2 === 0
            ? String.fromCharCode(Cmint.Util.random(65, 90))
            : String.fromCharCode(Cmint.Util.random(48, 57));
        i++;
    }
    return id;
}
Cmint.Sync.fn = (function() {
    
    // Takes a child and parent DOM element pair and returns
    // the index of the child within the parent.    
    function getContainerPosition(child, parent) {
        var position = null;
        $(parent).children().each(function(i) {
            if (this === child) {
                position = i;
            }
        })
        return position;
    }
    Cmint.Util.test('Cmint.Sync.fn.getContainerPosition', function() {
        var parent = $('<div></div>').append('<span></span>');
        var child = $('<p></p>');
        parent.append(child);

        return getContainerPosition(child[0], parent) === 1 ? 'Passed': 'Failed';
    })
    

    return {
        getContainerPosition: getContainerPosition
    }

})()
// Takes a component element in the stage and returns an array that
// acts as a map to its corresponding data in the main Vue instance.
//
// element = component element in stage
// position = position map as an array (for recursion)
// -> position array
Cmint.Sync.getStagePosition = function(element, position) {

    // parentContext = the nearest parent context element in stage
    // parentComponent = the nearest parent component element in stage
    // name = the name of the context container
    // index = the index in DOM which equals the index in data
    var parentContext, parentComponent, index, context, parent;

    // Setup
    position = position || [];
    parentContext = $(element).closest(Cmint.Settings.class.context);
    parentComponent = $(element).parent().closest(Cmint.Settings.class.component);
    name = parentContext.attr(Cmint.Settings.name.dataContext);
    index = Cmint.Sync.fn.getContainerPosition(element, parentContext);

    position.unshift(index);
    position.unshift(name);

    if (parentComponent.length) {
        return position = Cmint.Sync.getStagePosition(parentComponent[0], position);
    } else {
        return position;
    }

}

Cmint.Util.test('Cmint.Sync.getStagePosition', function() {

    var stage = $('<div class="'+Cmint.Settings.name.context+'" '+Cmint.Settings.name.dataContext+'="stage"></div>');
    var compParent = $('<div class="'+Cmint.Settings.name.component+'"></div>');
    var context = $('<div class="'+Cmint.Settings.name.context+'" '+Cmint.Settings.name.dataContext+'="foo"></div>');
    var compChild = $('<div class="'+Cmint.Settings.name.component+'"></div>');

    compParent.append(context);
    context.append(compChild);
    stage.append(compParent);

    var expected = ['stage', 0, 'foo', 0];
    var got = Cmint.Sync.getStagePosition(compChild[0]);
    var result = _.isEqual(expected, got);

    return [result, expected, got];

})
// Returns a copy of component data from the main Vue instance when given
// an array path that mirrors the location of the component in a nested data
// tree (from getStagePosition)
// position = array path to data object
// environment = array of component objects (stage or thumbnails)
Cmint.Sync.getComponentData = function(position, environment) {

    var data = Cmint.Util.copyObject(environment);
    var _position = Cmint.Util.copyObject(position);
    // remove the first item since that is provided by the environment
    _position.shift();

    _position.forEach(function(key, i) {
        if (typeof(key) === 'string') {
            data = data.contexts[key];
        } else {
            data = data[key];
        }
    })

    return data;

}

Cmint.Util.test('Cmint.Sync.getComponentData', function() {

    var environment = {
        foo: [ null, {
            contexts: {
                bar: [ null, { 
                    baz: 'tada'
                }]
            }
        }]
    }
    var position = ['foo', 1, 'bar', 1];
    var expected = { baz: 'tada' };
    var got = Cmint.Sync.getComponentData(position, environment.foo);
    var result = _.isEqual(expected, got);

    return [result, expected, got];

})
// Whereas getComponentData returns a copy of the component object
// data, this function returns the actual Vm context and position for
// a given component. The Vm data is returned by reference so that it
// can be mutated (mostly for drag and drop scenarios)
// position = path array mirroring data location
// context = an array of component data objects
// -->
// {
//   context: the array housing the component data,
//   index: the index of the component data
// }
Cmint.Sync.getVmContextData = function(position, context) {

    var output,
        _position = Cmint.Util.copyObject(position),
        _context = context;

    _position.shift();

    _position.forEach(function(key, i) {
        if (i === (_position.length - 1)) {
            output = {
                context: _context,
                index: key
            }
        } else {
            if (typeof(key) === 'string') {
                _context = _context.contexts;
            }
            _context = _context[key]; 
        }
    })

    return output;

}

Cmint.Util.test('Cmint.Sync.getVmContextData', function() {

    var context = {
        foo: [null, {
            contexts: {
                bar: [null, {
                    baz: 'tada'
                }]
            }
        }]
    }
    var position = ['foo', 1, 'bar', 1];
    var expected = { 
        context: [null, {baz: 'tada'}],
        index: 1
    }
    var got = Cmint.Sync.getVmContextData(position, context.foo);
    var result = _.isEqual(got, expected);

    return [result, expected, got];

})
// Takes data and inserts it into the spot that the position points to within
// a given environment.
Cmint.Sync.insertVmContextData = function(position, data, environment) {

    var context = environment,
        currentContext = Cmint.Sync.getVmContextData(position, context);
        currentContext.context.splice(currentContext.index, 0, data);
    return environment;

}

Cmint.Util.test('Cmint.Sync.insertVmContextData', function() {

    var context = {
        foo: [
            { contexts: { biz: { bal: 'boo' }}},
            { contexts: { bar: [
                { buz: 'byz' },
                { baz: 'tada' }
            ]}}
        ]}
    var position = ['foo', 1, 'bar', 2];
    var data = { beez: 'bundle' };
    var expected = [
        { contexts: { biz: { bal: 'boo' }}},
        { contexts: { bar: [
            { buz: 'byz' },
            { baz: 'tada' },
            { beez: 'bundle' }
        ]}}
    ]
    var got = Cmint.Sync.insertVmContextData(position, data, context.foo);
    var result = _.isEqual(expected, got);

    return [result, expected, got];

})
// When components are rearranged on stage using dragula, we need to revert what dragula
// did to the DOM and then give control back over to the Vm data. This function
// takes the dragged data and splices it into the dropped context data.
// Both parameters are the result of Sync.getVmContextData.
Cmint.Sync.rearrangeVmContextData = function(fromData, toData) {

    toData.context.splice(toData.index, 0, fromData.context.splice(fromData.index, 1)[0]);
    Cmint.Util.debug('rearranging Vm context data');

}
Cmint.Sync.removeVmContextData = function(vmData) {

    vmData.context.splice(vmData.index, 1);

}
// Creates a component and stores confit in Components
// Note: your template root element must always be <comp></comp>
// The <comp> component is the meta wrapper that handles all component logic.
// All component markup will be passed via slot.
//
/*  Available config options
    {
        name: 'machine-name', (required)
        display: 'Display Name', (required)
        category: 'Category Name', (required)
        tags: {
            root: 'h1' (overrides <comp> default div),
            other: 'main' (for context components in template)
        },
        contexts: {
            'left-column': [] (for nested components)
        },
        content: {
            'article': 'Lorem ipsum' (for data-edit that triggers tinymce)
        },
        hooks: ['name'], (runs on mount and receives component root element)
        tokens: [
            { 'token name': 'content or fields.output key name' }
        ],
        fields: {
            output: {
                'resultKey': 'value from post-processed field input'
            },
            list: [{ name: 'fieldname', result: 'output-key'}]
        }
    }
*/
Cmint.createComponent = function(options) {
    if (!options.template) console.error('All components need a template');
    if (!options.config) console.error('All components need config options');
    if (Cmint.Instance.Components[options.config.name]) {
        console.error('Component "'+options.config.name+'" already exists')
    } else {
        if (!options.config.index) options.config.index = [];
        Cmint.Instance.Components[options.config.name] = options.config;
        Vue.component(options.config.name, {
            props: ['config'],
            template: options.template
        })
    }
}
// Creates a component hook function
// Component hooks fire when a component is mounted or updated by Vue.
// Hook types can be 'Local' or 'Global'. Local hooks need to be referenced
// in the component config and will onyl run on that component. Global
// hooks will run on every single component.
// Component hooks take the components root element.
Cmint.createComponentHook = function(name, type, fn) {
    if (Cmint.Instance.Hooks[type][name]) {
        console.error(type + ' component hook "'+name+'" already exists');
    } else {
        Cmint.Instance.Hooks[type][name] = fn;
    }
}
// Creates a tinymce editor post process.
// These will run on a tinymce editor instance after it has updated.
// Takes 'rootElem' of the inline editor (e.target)
Cmint.createEditorPostProcess = function(fn) {
    Cmint.Instance.Editor.PostProcesses.push(fn);
}
// Creates a new field instance
// Input = {
//     name: 'machine-name',
//     config: {
//          type: 'field-type', (required)
//          display: 'Appears in Dropdowns', (required)
//          label: 'Appears above field', (required)
//          help: 'Help text appears under the field',
//          check: /.*/g, used to check text fields
//          input: 'name of input key stored in component data', (required)
//              * field-text, field-choice, field-dropdown = String
//              * field-group = array [{name, label, type}]
//          choices: [{name, result}]
//              * field-choice - field definitions like in a component
//          hook: 'name' of field hook to run before sending to output,
//          menu: 'name' of a menu
//     }   
// }
Cmint.createField = function(options) {

    if (!options.name) console.error('You must give all created fields a name');
    if (!options.config.type) console.error('You must give all created fields a field type');
    if (!options.config.label) console.error('You must give all created fields a label');
    if (!options.config.input && !options.config.type === 'field-choice') console.error('You must associate all created fields with an input');
    
    if (Cmint.Instance.Fields.List[options.name]) {
        console.error('Field "'+options.name+'" already exists');
    } else {
        Cmint.Instance.Fields.List[options.name] = options.config;
    } 

}
// Field processes will take field inputs after they have been run
// through the token system, mutate the value in some way, and return
// it to be stored in the field output.
// Keep in mind that some fields may use tokens based on content regions
// so every time tinymce triggers a change these processes will run.
Cmint.createFieldProcess = function(name, fn) {
    if (Cmint.Instance.Fields.Processes[name]) {
        console.error('Field process "'+name+'" already exists')
    } else {
        Cmint.Instance.Fields.Processes[name] = fn;
    }
}
// Defines a menu for dropdown fields.
// Each key is mapped to a value that will be inserted into a field input.
Cmint.createMenu = function(name, map) {
    
    if (Cmint.Instance.Menus[name]) {
        console.error('Menu "' + name + '" already exists');
    } else {
        Cmint.Instance.Menus[name] = map;
    }

}
Cmint.createOnSaveHook = function(fn) {
    Cmint.Hooks.onSaveHook = fn;
}
// Defines a template and assigns path and components
// options = {
//     path: '/path/to/template.html',
//     components: ['names', 'of', 'components']   
// }
Cmint.createTemplate = function(name, options) {

    if (Cmint.Instance.Templates[name]) {
        console.error('Template "' + name + '" already exists');
    } else {
        if (!options.path) {
            console.error('Need path for template "' + name + '"');
        }
        if (!options.components) {
            console.error('No components defined for template "' + name +'"');
        }
        Cmint.Instance.Templates[name] = options;
    }

}
// Once someone is done editing content, your application will probably
// want to do something with all of the data via an ajax request to some route.
// Use this function to add a button to the toolbar that carries out 
// whatever you need it to carry out.
/* Options are:
    {
        text: 'button text',
        btnClasses: { 'toolbar-save': true }
        iconClasses: {'fa': true, 'fa-save': true },
        disable: true,                                  
        callback: function(toolbar, config) { // toolbar = DOM, config = these options
            ** sky's the limit **
        }
    }

    * Note 1: if 'disable' is set to true, the button's disable attribute can be toggled 
      by emitting 'toolbar-disabler' with a value of true or false

    * Note 2: if you'd like the button to look different, just add a class and style it yourself.
      If you want to use the theme's version, assign 'toolbar-btn-fancy' as true in btnClasses.

    * Note 3: if the button toggles state rather than just performing an action, you can toggle
      the active statue of the button by adding 'active' to the list of btnClasses. Then, in the
      click callback, you can do config.btnClasses.active = !config.btnClasses.active

*/
Cmint.createToolbarButton = function(options) {
    Cmint.Ui.Toolbar.push(options)
}

// Default buttons
Cmint.createToolbarButton({
    text: 'Save',
    btnClasses: { 'toolbar-save': true },
    iconClasses: { 'fa': true, 'fa-save': true },
    callback: function(button) {
        Cmint.App.save();
    }
})

Cmint.createToolbarButton({
    text: 'Context',
    btnClasses: { 'toolbar-context': true, 'active': false },
    iconClasses: { 'fa': true, 'fa-object-ungroup': true },
    callback: function(toolbar, config) {
        config.btnClasses.active = !config.btnClasses.active;
        Cmint.Bus.$emit('contextualize');
        Cmint.Util.debug('Contextualizing stage components');
    }
})

Cmint.createToolbarButton({
    text: 'Undo',
    btnClasses: { 'toolbar-undo': true },
    iconClasses: { 'fa': true, 'fa-undo': true },
    disable: null,
    callback: function() {
        Cmint.App.undo();
    }
})
Cmint.getFullMarkup = function() {

    return Cmint.App.templateMarkup.replace(/\{\{\s*stage\s*\}\}/, Cmint.App.markup)

}
Cmint.getMarkup = function() {

    var markup = Cmint.App.stage.map(function(comp) {
        return comp.markup;
    }).join('\n');

    return markup;

}

// components.
Vue.component('comp', {

    props: ['config', 'tag'],

    render: function(make) {
        var classes = {};
        var tag = this.config.tags && this.config.tags.root
            ? this.config.tags.root
            : 'div';
        tag = this.tag ? this.tag : tag;
        classes[Cmint.Settings.name.component] = true;
        classes[Cmint.Settings.name.contextualize] = this.contextualize;

        return make(
            tag, { 'class': classes },
            this.$slots.default
        )
    },

    data: function(){return{
        environment: null
    }},

    computed: {
        contextualize: function() {
            return Cmint.App ? Cmint.App.contextualize : false;
        }
    },

    methods: {

        run: function(action) {
            var _this = this;
            var $el = $(_this.$el);

            // Is the component staged, or in the component sidebar?
            _this.environment = $el.closest(Cmint.Settings.id.components).length
                ? 'components'
                : 'stage';

            // Get the component's position in data from its position in DOM
            _this.config.index = Cmint.Sync.getStagePosition(_this.$el);

            // Assign field uid if component utilizes fields system
            if (_this.config.fields) Cmint.Fields.assignUid(_this);

            // Adding custom, originalDisplay, originalCategory
            Cmint.AppFn.compSetup(_this.config);

            // Watch for updates to the same custom component type and splice accordingly
            // Cmint.AppFn.updateStageCustomComponents(this);
            Cmint.Bus.$on('deleteCustomComponent', function(name) {
                if (_this.config.custom && _this.config.display === name) {
                    _this.config.custom = false;
                    _this.config.display = _this.config.originalDisplay;
                    _this.config.category = _this.config.originalCategory;
                }
            })
            
            // Run component hooks
            Cmint.Hooks.runComponentHooks('editing', _this.$el, _this.config);

            // Run editor initiation
            Cmint.Editor.init(_this);

            // Run actionbar handler
            Cmint.Ui.actionbarHandler(_this);

            // Get markup after setTimeout to give tinymce some time to
            // update the DOM if needed
            setTimeout(function() {
                Cmint.AppFn.getComponentMarkup(_this);
            }, 100);
            
            Cmint.Util.debug(action + ' <comp> "' + _this.config.name + '"');
        }

    },

    created: function() {
        Cmint.Fields.setOutputWatch(this);
    },

    mounted: function() {
        this.run('mounted');
    },

    updated: function() {
        this.run('updated');
    }

})
// Meta component for contextual regions that nest <comp> instances
Vue.component('context', {

    props: ['tag', 'insert', 'contexts', 'thumbnails'],

    render: function(make) {

        var classes = {};
        var tag = this.tag || 'div';
        var insertTag = this.insert || 'div';
        var output;

        classes[Cmint.Settings.name.context] = true;

        if (this.thumbnails) {
            output = this.contexts.map(function(child) {
                return make('div', {'class': {'thumbnail': true}}, [
                    make('span', {'class': {'thumbnail-name': true}}, [child.display]),
                    make('div', {'class': {'thumbnail-component': true}}, [
                        make('div', {'class': {'thumbnail-scale-wrap': true}}, [
                            make(child.name, {props:{ 'config': child }})
                        ])
                    ])
                ])
            })
        } else {
            output = this.contexts.map(function(child) {
                return make(child.name, {
                    props: { 'config': child },
                    key: child.id
                })
            })
        }
        if (!this.contexts.length) {
            output = [make(insertTag, {'class':{'context-insert':true}},['Drag components here'])]
        }

        return make(
            tag, { 'class': classes },
            output
        )
    }

})
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
Vue.component('sidebar', {

    props: ['components'],

    template: '\
        <aside id="Sidebar" :class="{active:isActive}">\
            <div class="cmint-sidebar-handle" @click="toggle">\
                <i :class="handleClasses"></i>\
            </div>\
            <div class="sidebar-sub">\
                <categories :components="components"></categories>\
            </div>\
            <div class="sidebar-main">\
                <context id="Components"\
                    data-context="components"\
                    :thumbnails="true"\
                    :contexts="componentList"></context>\
            </div>\
        </aside>',

    data: function(){return{

        isActive: true,
        componentList: this.components

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
        },

        updateThumbnails: function() {
            Cmint.Ui.refreshComponentList();
        }

    },

    mounted: function() {

        var _this = this;
        _this.handleClasses['fa-close'] = true;
        Cmint.Ui.componentList = _this.componentList;

        _this.$bus.$on('filteredCategories', function(filtered) {
            _this.componentList = filtered;
            Cmint.Ui.componentList = _this.componentList;
        })

        _this.$bus.$on('updateComponentList', function(newComponent) {
            _this.componentList.push(newComponent);
        })

        _this.$bus.$on('toggleToolbar', function(toolbarState) {
            if (!toolbarState) {
                _this.isActive = false;
            }
        })

        Cmint.Bus.$on('openSidebar', function() {
            _this.isActive = true;
        })

        this.updateThumbnails();

    },

    updated: function() {

        this.updateThumbnails();

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
        selected: 'All'
    }},

    methods: {
        select: function(item) {
            this.selected = item || 'All';
            this.toggle = false;
            var filtered = this.components;
            if (this.selected !== 'All') {
                filtered = this.components.filter(function(comp) {
                    return comp.category === item;
                })
            }
            this.$bus.$emit('selectedCategory', item);
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
                return comp.category;
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
        Cmint.Bus.$on('selectCategory', function(category) {
            category = category || _this.selected;
            _this.select(category);
        })
    }

})
Vue.component('custom', {

    template: '\
        <div :class="classes">\
            <div class="custom-heading">\
                <button class="custom-done" @click="closeCustom"><i class="fa fa-chevron-left"></i>Done</button>\
                <span>Custom Component</span>\
            </div>\
            <div class="custom-form">\
                <label>Name</label>\
                <input type="text" v-model="name" placeholder="Component name" :disabled="isCustom || null" />\
                <div :class="{ nameError: true, show: hasError }" v-text="nameError"></div>\
                <label>Category</label>\
                <input type="text" v-model="category" placeholder="Category (Default \'Custom\')" :disabled="isCustom || null" />\
                <button v-if="!isCustom" class="add-btn" @click="addCustom">Save Component</button>\
                <button v-if="isCustom" class="delete-btn" @click="deleteCustom">Delete</button>\
            </div>\
        </div>',

    // Removing this for now. See below.
    //<button v-if="isCustom" class="update-btn" @click="updateCustom">Update Component</button>\
    
    data: function() {return{
        name: '',
        category: '',
        nameError: false,
        hasError: false,
        isActive: false,
        isCustom: false
    }},

    computed: {
        classes: function() {
            return {
                'custom-add-wrap': true, 
                cmint: true, 
                active: this.isActive
            }
        }
    },

    methods: {
        addCustom: function() {
            Cmint.AppFn.createCustomComponent(this);
        },
        // This is probably taking things a bit too far at the moment. Updating custom components
        // the way I'm doing with this function wouldn't actually be intuititive for the user and
        // would cause confusion when other pieces of content are opened with that custom component
        // since they wouldn't match up. For now, you can just add or delete custom structures.
        // Instances of those custom structures can be manipulated without modifying the original.
        // updateCustom: function() {
        //     Cmint.AppFn.updateCustomComponent(this);
        // },
        deleteCustom: function() {
            Cmint.AppFn.deleteCustomComponent(this);
        },
        closeCustom: function() {
            Cmint.Bus.$emit('closeCustomModal');
        }
    },

    mounted: function() {

        var _this = this;

        Cmint.Bus.$on('callCustomModal', function() {
            Cmint.Bus.$emit('toggleOverlay', true);
            _this.isCustom = Cmint.App.activeComponent.config.custom;
            _this.name = _this.isCustom ? Cmint.App.activeComponent.config.display : '';
            _this.category = _this.isCustom ? Cmint.App.activeComponent.config.category : '';
            _this.isActive = true;
        })

        Cmint.Bus.$on('closeCustomModal', function() {
            Cmint.Bus.$emit('toggleOverlay', false);
            _this.isActive = false;
            _this.name = '';
            _this.category = '';
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
            <button :class="{\'actionbar-new\':true, custom: isCustom}" @click="callCustomModal">\
                <i :class="customClasses"></i></button>\
            <button :class="{\'actionbar-fields\': true, hidden: noFields}" @click="callFields">\
                <i class="fa fa-cog"></i></button>\
        </div>',

    data: function() {
        return {
            top: '20px',
            left: '20px',
            display: 'block',
            isActive: false,
            noFields: true,
            newComp: false,
            focused: false,
            isCustom: false
        }
    },

    computed: {
        css: function() {
            return {
                'display': this.display,
                'top': this.top,
                'left': this.left,
                'position': 'absolute'
            }
        },
        customClasses: function() {
            return {
                'fa': true,
                'fa-plus': !this.isCustom,
                'fa-star': this.isCustom
            }
        }
    },

    methods: {

        trashComponent: function() {
            Cmint.Ui.removeComponent();
        },

        copyComponent: function() {
            Cmint.Ui.copyComponent();
        },

        callCustomModal: function() {
            // Cmint.Ui.callCustomModal(this);
            Cmint.Bus.$emit('callCustomModal');
        },

        callFields: function() {
            Cmint.Bus.$emit('callComponentFields');
            Cmint.Bus.$emit('toggleOverlay', true);
            this.$bus.$emit('closeActionBar');
        }
    },

    mounted: function() {
        var _this = this;
        this.$bus.$on('getComponentCoordinates', function(spot, component) {
            _this.top = spot.top;
            _this.left = spot.left;
            _this.hasFields = component.fields;
            _this.display = 'block';
        })
        this.$bus.$on('openActionBar', function(component) {
            _this.noFields = component.config.fields === undefined;
            _this.isActive = true;
            _this.isCustom = Cmint.App.activeComponent.config.custom;
            var left = _this.left.replace('px','') * 1;
            var top = _this.top.replace('px','') * 1;
            if (left < 48) {
                _this.left = '48px';
            }
            if (top < 45) {
                _this.top = '45px';
            }
            Cmint.Util.debug('active component is "'+Cmint.App.activeComponent.config.name+'"');
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
Vue.component('content-template', {

    props: ['fields-component', 'template', 'stage'],

    template: '',

    data: function() {return {
        sidebarOpen: true,
        toolbarOpen: true,
        scale: false
    }},

    computed: {
        margin: function() {
            var right = this.sidebarOpen ? '360px' : '0';
            var top = this.toolbarOpen ? '40px' : '0';
            return {
                'margin-right': right,
                'margin-top': top
            }
        },
        scaleClass: function() {
            return { scale: this.scale }
        }
    },

    created: function() {

        var stage = '<context id="Stage" :contexts="stage" data-context="stage"></context>';
        var template = '<div id="Template" :style="margin" :class="scaleClass">';
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
        Cmint.Bus.$on('toggleOverlay', function(show) {
            _this.scale = show;
        })
        Cmint.Bus.$on('moveTemplateLeft', function() {
            _this.sidebarOpen = true;
            _this.toolbarOpen = true;
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
        Cmint.Bus.$on('toggleOverlay', function(show) {
            if (show) {
                $el.addClass('active');
                setTimeout(function() {
                    $el.addClass('visible');
                }, 20);
            } else {
                $el.removeClass('visible');
                setTimeout(function() {
                    $el.removeClass('active');
                }, 200);
            }
        })
    }
})
Cmint.Editor.config = {
    inline: true,
    menubar: false,
    insert_toolbar: false,
    force_hex_style_colors: true,
    fixed_toolbar_container: '#EditorToolbar',
    plugins: 'link lists paste textpattern autolink charmap',
    toolbar: 'bold italic alignleft aligncenter link bullist numlist superscript charmap',
    forced_root_block: 'div'
}
Cmint.Editor.init = function(component) {

    if (!component.config.content) return;

    var editable = $(component.$el).find(Cmint.Settings.attr.dataEdit);
    if ($(component.$el).attr(Cmint.Settings.name.dataEdit)) {
        editable.push($(component.$el));
    }

    editable.each(function() {

        var config = Cmint.Util.copyObject(Cmint.Editor.config),
            editorUid = Cmint.Util.uid(10),
            $this = $(this),
            contentKey = $this.attr(Cmint.Settings.name.dataEdit),
            stash;
            
        $this.html(component.config.content[contentKey]);

        if (component.environment === 'components') return;

        $this.attr('data-temp', editorUid);
        config.selector = '[data-temp="'+editorUid+'"]';

        config.init_instance_callback = function(editor) {
            stash = editor.getContent();
            editor.on('PostProcess', function(e) {
                Cmint.Instance.Editor.PostProcesses.forEach(function(fn) {
                    fn(e);
                })
            })
        }

        config.setup = function(editor) {
            if (component) 
            editor.on('Change keyup', _.debounce(function() {
                if (component) {
                    component.config.content[contentKey] = editor.getContent();
                    Cmint.Util.debug('updated content "'+contentKey+'" for ' + component.config.name);
                }
            }));
            editor.on('focus', function() {
                Cmint.Bus.$emit('showToolbar');
                component.config.content[contentKey] = editor.getContent();
                stash = editor.getContent();
            });
            editor.on('blur', function() {
                if (!component.config.content) return;
                if (component.config.content[contentKey] !== stash) {
                    Cmint.Bus.$emit('fieldProcessing');
                    Vue.nextTick(Cmint.App.refresh);
                    Vue.nextTick(Cmint.App.snapshot);
                    Cmint.App.save();
                }
            })
            $this.removeAttr('data-temp');
        }

        tinymce.init(config);

    })

}
Cmint.Ui.actionbarHandler = function(component) {

    if (component.environment === 'components') return;

    var element = component.$el,
        $el = $(element);

    $el.unbind();

    $el.click(function(e) {

        var nearestComponent = $(e.target).closest(Cmint.Settings.class.component);

        if (nearestComponent[0] === element && !nearestComponent.hasClass('active')) {

            Cmint.App.activeComponent = component;

            setTimeout(function() {
                var offset = $el.offset();
                var output = {};
                output.top = offset.top + 'px';
                output.left = offset.left + 'px';
                output.handle = offset.left + $el.width() + 'px';

                if($('#ActionBar.active').length) {
                    Cmint.Bus.$emit('closeActionBar');
                    setTimeout(function() {
                        Cmint.Bus.$emit('getComponentCoordinates', output, component);
                        setTimeout(function() {
                            Cmint.Bus.$emit('openActionBar', component);
                        }, 100);                                        
                    },200)
                } else {
                    Cmint.Bus.$emit('getComponentCoordinates', output, component);
                    setTimeout(function() {
                        Cmint.Bus.$emit('openActionBar', component);
                    }, 100); 
                }
            }, 50);

        }

    })

}
Cmint.Ui.callCustomModal = function(data) {

    var comp = Cmint.App.activeComponent;
    var position = Cmint.Sync.getVmContextData(comp.config.index, Cmint.App.stage);
    var clone = Cmint.Util.copyObject(position.context[position.index]);
    
    data.focused = clone;
    data.newComp = !data.newComp;

}
// Not used (for now). I'm leaving it here because there may be a time when I want it
Cmint.Ui.componentDragIconHandler = function(component) {

    var $comp = $(component.$el),
        offset = $comp.offset(),
        width = $comp.width();

    $comp.unbind('mouseenter mouseleave');

    $comp.on('mouseenter', function() {
        $(this).addClass('maybeActive');
    })
    $comp.on('mouseleave', function() {
        $(this).removeClass('maybeActive');
    })

    $(document).on('mousemove', function(event) {

        var left = event.pageX,
            top = event.pageY,
            maybe = $comp.hasClass('maybeActive'),
            draggable = $comp.hasClass('draggable'),

            inZone = left > offset.left + width - 25 &&
                     left < offset.left + width + 5 &&
                     top > offset.top - 5 &&
                     top < offset.top + 25;

        if (inZone && !draggable) {
            $comp.addClass('draggable');
        } else if (!inZone && draggable) {
            $comp.removeClass('draggable');
        }

    })

}
Cmint.Ui.contextualize = function() {

    Cmint.Bus.$on('contextualize', function() {

        Cmint.App.contextualize = !Cmint.App.contextualize;

    })

}
Cmint.Ui.copyComponent = function() {

    var comp = Cmint.App.activeComponent;
    var position = Cmint.Sync.getVmContextData(comp.config.index, Cmint.App.stage);
    var clone = Cmint.Util.copyObject(position.context[position.index])

    clone.copy = true;

    position.context.splice(position.index + 1, 0, clone);

    Vue.nextTick(Cmint.Drag.updateContainers);
    Vue.nextTick(Cmint.App.snapshot);

    // If a component with fields is copied it must have it's fields initiated by
    // mounting the fields widget with the component. Otherwise it will not be
    // linked to Fields.UIDS and any updates made to editor content will not trigger
    // field processes.
    if (!!clone.fields) {
        Cmint.App.fieldsMountOnly = true;
        Cmint.App.fieldsComponent = clone;
        setTimeout(function() {
            Cmint.App.fieldsMountOnly = false;
            Cmint.App.fieldsComponent = null;
        },20)
    }
    
    Cmint.Bus.$emit('closeActionBar');
    Cmint.Util.debug('copied ' + comp.config.name + '[' + comp.config.index + ']');
    Cmint.App.save();

}
Cmint.Ui.documentHandler = function() {

    $(document).on({

        'click': function(e) {

            var $target = $(e.target);
            var isComponent = $target.closest(Cmint.Settings.class.component).length;
            var isInStage = $target.closest(Cmint.Settings.id.stage).length;
            var isActionBar = $target.closest(Cmint.Settings.id.actionbar).length;
            var categoryList = $target.closest(Cmint.Settings.class.categories).length;
            var fieldChoice = $target.closest(Cmint.Settings.class.fieldchoice).length;
            var dropdown = $target.closest(Cmint.Settings.class.dropdown).length; 

            if (isComponent && isInStage) {
                var component = $target.closest(Cmint.Settings.class.component);
                if (!component.hasClass('active')) {
                    $(Cmint.Settings.class.component + '.active').removeClass('active');
                    component.addClass('active');
                }
                // blur the previously focused editor instance
                $('.mce-edit-focus').each(function() {
                    if (!$(this).closest(Cmint.Settings.class.component).hasClass('active')) {
                        $(this).blur();
                    }
                })
                
            } else {
                $(Cmint.Settings.class.component + '.active').removeClass('active');
                if (!isActionBar && Cmint.App.activeComponent) {
                    Cmint.Util.debug('deactivated component "'+Cmint.App.activeComponent.config.name+'"');
                    Cmint.Bus.$emit('closeActionBar');
                }
            }

            if (!categoryList) { Cmint.Bus.$emit('closeCategoryList'); }

            if (!fieldChoice) { Cmint.Bus.$emit('closeFieldChoice'); }

            if (!dropdown) { Cmint.Bus.$emit('closeDropdown'); }

        }

    })

}
Cmint.Ui.refreshComponentList = function() {

    $(Cmint.Settings.id.components).css({opacity: 0})
    setTimeout(function() {
        $('.thumbnail-scale-wrap').each(function() {
            $(this).parent().attr('style', null);
            var h = $(this).parent().height()
            h = h + 34 - 36;
            h = h / 2;
            $(this).parent().height(h)
        })
        $(Cmint.Settings.id.components).animate({opacity: 1}, 400);
    }, 600);

}

Cmint.Ui.removeComponent = function() {

    var comp = Cmint.App.activeComponent;
    var position = Cmint.Sync.getVmContextData(comp.config.index, Cmint.App.stage);

    position.context.splice(position.index, 1);
    Vue.nextTick(Cmint.Drag.updateContainers);
    Vue.nextTick(Cmint.App.snapshot);

    Cmint.Bus.$emit('closeActionBar');
    Cmint.Util.debug('removed "' + comp.config.name + '" [' + comp.config.index + ']');
    Cmint.App.save();

}
// Some field processes need to hold on to specific component data so that when that data
// mutates, they can run and update any tokens that may have been used. Because Vue creates
// new instances of component data on mount and update, those data sets were being eliminated
// and the field processes would be updating data that was no longer attached to anything.
// With field uids, all field processing will be sent to whatever component is referenced by
// Fields.UIDS.
Cmint.Fields.assignUid = function(component) {

    var uid;

    if (component.config.fields &&
        component.environment === 'stage' &&
        !component.config.fields.uid || component.config.copy) {

        uid = Cmint.Util.uid(12);
        while (Cmint.Fields.UIDS.hasOwnProperty(uid)) {
            uid = Cmint.Util.uid(12);
        }
        component.config.fields.uid = uid;
        Cmint.Util.debug('assigned field uid "'+uid+'" to component at [' + component.config.index + ']');

        if (component.config.copy) {
            component.config.copy = false;
        }

    }

    // If a custom component is being added, its components may already have field uids.
    // If that is the case, check if that uid exists in Cmint.Fields.UIDS. If so, generate
    // a new uid, add it to UIDS, and assign it to the component.
    if (component.config.fields.uid) {
        if (Cmint.Fields.UIDS.hasOwnProperty(uid)) {
            component.config.fields.uid = Cmint.Util.uid(12);
        }
        Cmint.Fields.UIDS[component.config.fields.uid] = component;
    }

}
Cmint.Fields.processFieldText = function(instance) {

    var fieldData = instance.fields[instance.field.name];
    var input = instance.field.inputs[fieldData.input];
    var compUid = instance.component.fields.uid;
    var component = Cmint.Fields.UIDS[compUid];

    // tokenize
    if (component.config.tokens) {
        input = Cmint.Fields.tokenize(input, component.config);
    }

    // run check function
    if (instance.field.check && input !== '') {
        instance.pass = !!input.match(instance.field.check);
        Cmint.Util.debug('field passed - ' + instance.pass);
    }

    // run user-defined field processes
    if (instance.field.processes) {
        instance.field.processes.forEach(function(fn) {
            input = Cmint.Instance.Fields.Processes[fn](input);
            Cmint.Util.debug('ran "'+fn+'" field process')
        })
    }

    // send to declared output
    component.config.fields.output[instance.field.result] = input;

}
Cmint.Fields.setOutputWatch = function(component) {

    if (component.config.tokens) {
        component.$options.watch = {};
        component.config.tokens.forEach(function(token) {
            var source = token[Object.keys(token)[0]];
            component.$watch(
                function() {
                    if (component.config.fields) {
                        return component.config.fields.output[source];
                    }
                },
                function(newVal, oldVal) {
                    Cmint.Bus.$emit('outputUpdate', source);
                }
            )
        })
    }

}
Cmint.Fields.tokenize = function(input, component) {

    var output = input;

    if (!component.tokens || !output) return output;

    component.tokens.forEach(function(pair) {
        var token = Object.keys(pair)[0];
        var key = pair[token];
        var exp = new RegExp('\\{\\{\\s*'+token+'\\s*\\}\\}', 'g');
        var value, matches;

        // searches content keys first
        if (component.content && component.content[key]) {
            value = component.content[key].replace(/<.+?>/g,'');
        }

        // searches fields.output keys next
        else if (component.fields.output[key]) {
            value = component.fields.output[key]
        }

        // finally searches through input keys
        else {
            component.fields.list.forEach(function(field) {
                value = field.inputs[key] || value;
            })
        }

        value = value || '';
        matches = output.match(exp);
        if (matches) {
            output = output.replace(exp, value);
            Cmint.Util.debug('tokenized {{ '+token+' }} => ' + value);
        }

    })

    return output;
}
Cmint.Fields.watchOutputUpdates = function(fieldComponent) {
    fieldComponent.$bus.$on('outputUpdate', function(output) {
        if (output !== fieldComponent.field.result) {
            fieldComponent.process();
        }
    })
}
Cmint.Hooks.runComponentHooks = function(event, thing, data) {

    var Local = Cmint.Instance.Hooks.Local;
    var Global = Cmint.Instance.Hooks.Global;

    for (var hook in Global) {
        if (Global[hook][event]) {
            Global[hook][event](thing, data);
            Cmint.Util.debug('ran global component hook "'+hook+'" on event "'+event+'"')
        }
    }

    if (data.hooks) {
        data.hooks.forEach(function(hook) {
            if (Local.hasOwnProperty(hook)) {
                if (Local[hook][event]) {
                    Local[hook][event](thing, data);
                    Cmint.Util.debug('ran local component hook "'+hook+'" on event "'+event+'" for ' + data.name)
                }
            }
        })
    }

}
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
        fields: Cmint.Instance.Fields.List,
        pass: true
    }},

    computed: {
        check: function() {
            return this.pass ? {'color': 'rgba(0,0,0,0.4)'} : {'color': '#E57373'};
        }
    },

    methods: {
        process: _.debounce(function() {
            Cmint.Fields.processFieldText(this);
        }, 500)
    },

    beforeMount: function() {
        Cmint.Fields.watchOutputUpdates(this);
    },

    mounted: function() {
        var _this = this;
        Cmint.Fields.processFieldText(_this);
        Cmint.Bus.$on('fieldProcessing', function() {
            Cmint.Fields.processFieldText(_this);
            Cmint.Util.debug('processed field "'+_this.field.name+'" after tinymce editing');
        })
        Cmint.Util.debug('mounted <field> "'+this.field.name+'"');
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
        fields: Cmint.Instance.Fields.List,
        menu: Cmint.Instance.Menus[this.field.menu],
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
        process: function(selection) {
            var _menus = Cmint.Instance.Menus;
            var _fields = Cmint.Instance.Fields.List;
            var _processes = Cmint.Instance.Fields.Processes;
            var _this = this;
            var output = _menus[this.field.menu][selection];
            if (this.field.processes) {
                this.field.processes.forEach(function(fn) {
                    output = _processes[fn](output, this.component, this.field);
                })
            }
            this.field.inputs[_fields[this.field.name].input] = selection;
            this.selected = selection;
            this.component.fields.output[this.field.result] = output;
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
        fields: Cmint.Instance.Fields.List
    }},

    methods: {
        process: function() {
            var output,
                compUid = this.component.fields.uid,
                _this = this,
                _processes = Cmint.Instance.Fields.Processes;
            if (_this.field.processes) {
                _this.field.processes.forEach(function(fn) {
                    output = _processes[fn](_this.field.inputs, Cmint.Fields.UIDS[compUid].config);
                })
            } else {
                console.error('Field groups must have associated processes');
            }
            Cmint.Fields.UIDS[compUid].config.fields.output[this.field.result] = output;
        },
        firstUppercase: function(txt) {
            return txt.charAt(0).toUpperCase() + txt.replace(/^./,'');
        }
    },
    beforeMount: function() {
        Cmint.Fields.watchOutputUpdates(this);
    },
    mounted: function() {
        var _this = this;
        Cmint.Bus.$on('fieldProcessing', function() {
            _this.process();
            Cmint.Util.debug('processed field "'+_this.field.name+'" after tinymce editing');
        });
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
        fields: Cmint.Instance.Fields.List,
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
            var _fields = Cmint.Instance.Fields.List;
            _this.toggle = false;
            _this.selectionData = null;
            _this.selectedFieldData = null;
            _this.selected = 'None';

            _this.field.selected = _this.selected;
            _this.field.selectionData = _this.selectionData;
            _this.field.selectedFieldData = _this.selectedFieldData;

            Vue.nextTick(function() {
                if (selection !== 'None') {
                    var data = Cmint.Util.copyObject(selection);
                    data.result = _this.field.result;
                    _this.selectionData = data;
                    _this.selectedFieldData = _fields[_this.selectionData.name];
                    _this.selected = _this.selectedFieldData.display;

                    _this.field.selected = _this.selected;
                    _this.field.selectionData = _this.selectionData;
                    _this.field.selectedFieldData = _this.selectedFieldData;
                }
                Cmint.Util.debug('field chosen: ' + _this.selected);
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
Vue.component('field', {
    props: ['field', 'component'],
    template: '\
        <div class="field-wrap">\
            <component :is="field.type" :field="field" :component="component"></component>\
        </div>',
    beforeMount: function() {
        // result = default output listed in components
        var result = this.component.fields.output[this.field.result];

        // field instances aren't components; they're object literals passed to field components
        var fieldData = Cmint.Instance.Fields.List[this.field.name];

        this.field.label = fieldData.label;
        this.field.type = fieldData.type;
        this.field.display = fieldData.display;
        this.field.menu = fieldData.menu || null;
        this.field.choices = fieldData.choices || null;
        this.field.help = fieldData.help || null;
        this.field.check = fieldData.check || null;
        this.field.processes = fieldData.processes || null;
        
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
                if (!this.field.processes) throw 'ERROR at '+this.field.name+': All field-group fields must have an associated processes';
                var inputs = this.field.inputs;
                fieldData.input.forEach(function(inp) {
                    inputs[inp.name] = { label: inp.label, type: inp.type, value: '' };
                })
            }
        }

    }
})
Vue.component('fields', {
    props: ['component', 'mountonly'],
    template: '\
        <div :class="wrapClasses">\
            <div class="fields-top">\
                <button class="fields-close-btn" @click="close">\
                    <i class="fa fa-chevron-left"></i>Done\
                </button>\
                <div class="fields-header">{{ component.display }}</div>\
                <div class="field-tokens" v-if="component.tokens">\
                    <i class="fa fa-question-circle-o"></i>\
                    <span>Tokens: </span><span class="token-wrap" v-html="tokens"></span>\
                </div>\
            </div>\
            <div class="field-list">\
                <field v-for="field in component.fields.list" :field="field" :component="component" :key="field.id"></field>\
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
            return this.component.tokens.map(function(pair) {
                return '<span>{{ '+ Object.keys(pair)[0] + ' }}</span>';
            }).join(', ');
        }
    },
    methods: {
        open: function(mountOnly) {
            var _this = this;
            if (!mountOnly) {
                setTimeout(function() {
                    _this.isActive = true;
                },50);
            } else {
                setTimeout(function() {
                    Cmint.App.fieldsComponent = null;
                })
            }
        },
        close: function() {
            var _this = this;
            setTimeout(function() {
                _this.isActive = false;
                // Cmint.Bus.$emit('closeFieldWidget');
                Cmint.Bus.$emit('toggleOverlay', false);
                setTimeout(function() {
                    Cmint.App.fieldsComponent = null;
                    Vue.nextTick(Cmint.App.snapshot);
                    Cmint.App.save();
                },200)
                Cmint.Util.debug('closed field wiget');
            },50);
            
        }
    },
    mounted: function() {
        if (!this.mountonly) {
            this.open();
            Cmint.Util.debug('opened fields for "' + this.component.name + '"');
        } else {
            Cmint.Util.debug('only mounting field component "'+this.component.name+'"')
        }
    }
})
Cmint.Drag.fn = (function(){

    function updateContainers() {
        $(Cmint.Settings.id.stage + ' ' + Cmint.Settings.class.context).each(function() {
            if (Cmint.Drag.drake.containers.indexOf(this) <= -1) {
                Cmint.Drag.drake.containers.push(this);
                Cmint.Util.debug('added container to drake.containers');
            }
        })
    }

    function insertPlaceholder() {
        var placeholder = '<div class="'+Cmint.Settings.name.placeholder+'" style="display:none;"></div>';
        if (Cmint.Drag.dragInsertType === 'prepend') {
            $(Cmint.Drag.dragPosition).prepend(placeholder);
        } else if (Cmint.Drag.dragInsertType === 'after') {
            $(placeholder).insertAfter(Cmint.Drag.dragPosition);
        }
    }

    function replacePlaceholder(replacement) {
        $(Cmint.Settings.class.placeholder).replaceWith(replacement);
    }

    return {
        updateContainers: updateContainers,
        insertPlaceholder: insertPlaceholder,
        replacePlaceholder: replacePlaceholder
    }

})()
Cmint.Drag.onDrag = function(element, source) {

    Cmint.Bus.$emit('closeActionBar');

    if (source === Cmint.Drag.components) {

        // Get the DOM position of the dragged element and then, using that index
        // get the corresponding piece of data in componentList (i.e. filtered component list)
        Cmint.Drag.dragFromComponents = true;
        Cmint.Drag.dragIndex = Cmint.Sync.getStagePosition(element);
        Cmint.Drag.dragData = Cmint.Sync.getComponentData(Cmint.Drag.dragIndex, Cmint.Ui.componentList);
        Cmint.Util.debug('dragging from component list at [' + Cmint.Drag.dragIndex + ']');

    }

    if ($(source).closest(Cmint.Settings.id.stage).length) {

        Cmint.Drag.dragFromComponents = false;
        Cmint.Drag.dragIndex = Cmint.Sync.getStagePosition(element);
        Cmint.Drag.dragData = Cmint.Sync.getComponentData(Cmint.Drag.dragIndex, Cmint.App.stage);

        Cmint.Drag.dragVmContextData = Cmint.Sync.getVmContextData(Cmint.Drag.dragIndex, Cmint.App.stage);

        if ($(element).prev().length === 0) {
            Cmint.Drag.dragInsertType = 'prepend';
            Cmint.Drag.dragPosition = $(element).parent();
        } else {
            Cmint.Drag.dragInsertType = 'after';
            Cmint.Drag.dragPosition = $(element).prev();
        }

        Cmint.Util.debug('dragging from stage at [' + Cmint.Drag.dragIndex + ']');
        Cmint.Util.debug('drag insert type is "'+Cmint.Drag.dragInsertType+'"');

    }

}
Cmint.Drag.onDrop = function(element, target, source, sibling) {

    var $element = $(element),
        $target = $(target),
        $source = $(source),
        dragVm,
        dropVm,
        dragIndex,
        dropIndex;

    Cmint.Drag.dropInContext = $target.closest(Cmint.Settings.class.context).length > 0;
    Cmint.Drag.dropReordered = $source.closest(Cmint.Settings.id.stage).length > 0;

    if (Cmint.Drag.dragFromComponents && Cmint.Drag.dropInContext) {

        Cmint.Drag.dropIndex = Cmint.Sync.getStagePosition(element);
        $element.remove();
        Cmint.Sync.insertVmContextData(Cmint.Drag.dropIndex, Cmint.Drag.dragData, Cmint.App.stage);
        Vue.nextTick(Cmint.App.refresh);
        Vue.nextTick(Cmint.Drag.fn.updateContainers);
        Vue.nextTick(Cmint.App.snapshot);
        Cmint.Util.debug('dropped new component "'+Cmint.Drag.dragData.name+'" in stage at [' + Cmint.Drag.dropIndex + ']');
        Cmint.App.save();
    }

    if (Cmint.Drag.dropReordered) {

        Cmint.Drag.fn.insertPlaceholder();
        Cmint.Drag.dropIndex = Cmint.Sync.getStagePosition(element);
        Cmint.Util.debug('dropped reordered component at [' + Cmint.Drag.dropIndex + ']');
        Cmint.Drag.fn.replacePlaceholder(element);
        Cmint.Util.debug('replaced placeholder with dropped element');
        Cmint.Drag.dropVmContextData = Cmint.Sync.getVmContextData(Cmint.Drag.dropIndex, Cmint.App.stage);

        dragVm = Cmint.Drag.dragVmContextData;
        dropVm = Cmint.Drag.dropVmContextData;

        // if the drop spot is the same context as the drag spot
        // we need to make sure we account for the placeholder in our index.
        // If the element is being dragged down, we need to subtract one from the
        // drop index on account of the placeholder.
        if (dropVm.context == dragVm.context) {
            dragIndex = dragVm.index;
            dropIndex = dropVm.index;
            if (dragIndex < dropIndex) dropVm.index = dropVm.index - 1;
            Cmint.Util.debug('reordered components in the same context');
        }

        Cmint.Sync.rearrangeVmContextData(dragVm, dropVm);
        Vue.nextTick(Cmint.App.refresh);
        Vue.nextTick(Cmint.Drag.updateContainers);
        Vue.nextTick(Cmint.App.snapshot);
        Cmint.App.save();
        // Util.debug('refreshing and updating containers')

    }

}
Cmint.Drag.onRemove = function(element, container, source) {
    
    if ($(source).closest(Cmint.Settings.id.stage).length) {

        Cmint.Drag.fn.insertPlaceholder();
        Cmint.Drag.fn.replacePlaceholder(element);
        $(element).removeClass('gu-hide');

        Cmint.Util.debug('removed component "'+Cmint.Drag.dragData.name+'" from stage at ' + Cmint.Drag.dragData.index);
        Cmint.Sync.removeVmContextData(Cmint.Drag.dragVmContextData);

        Vue.nextTick(Cmint.App.refresh);
        Vue.nextTick(Cmint.App.save);
        Vue.nextTick(Cmint.App.snapshot);

    }

}
Cmint.Drag.init = function() {

    Cmint.Drag.stage = $(Cmint.Settings.id.stage)[0];
    Cmint.Drag.components = $(Cmint.Settings.id.components)[0];

    Cmint.Drag.dragIndex = null;
    Cmint.Drag.dragData = null;
    Cmint.Drag.dragPosition = null;
    Cmint.Drag.dragFromComponents = null;
    Cmint.Drag.dragVmContextData = null;

    Cmint.Drag.dropInsertType = null;
    Cmint.Drag.dropIndex = null;
    Cmint.Drag.dropInContext = null;
    Cmint.Drag.dropReordered = null;
    Cmint.Drag.dropVmContextData = null;

    Cmint.Drag.config = {

        copy: function(element, source) {
            return source === Cmint.Drag.components;
        },

        accepts: function(element, target, source, sibling) {
            return target !== Cmint.Drag.components &&
                   !Cmint.Util.contains(element, target);
        }

    }

    Cmint.Drag.drake = dragula([ Cmint.Drag.stage, Cmint.Drag.components ], Cmint.Drag.config);

    Cmint.Drag.drake.on('drag', function(element, source) {
        Cmint.Drag.onDrag(element, source);
    });

    Cmint.Drag.drake.on('drop', function(element, target, source, sibling) {
        Cmint.Drag.onDrop(element, target, source, sibling);
    });

    Cmint.Drag.drake.on('remove', function(element, container, source) {
        Cmint.Drag.onRemove(element, container, source);
    })

}
Cmint.AppFn.checkCustomName = function(customModal) {
    
    var double = 'pass';

    // If no name, render error
    if (customModal.name === '') {
        customModal.nameError = 'Name field is blank';
        customModal.hasError = true;
        return 'blank';
    }

    // Find any duplicate names
    Cmint.App.components.forEach(function(component) {
        if (component.display === customModal.name) {
            double = 'fail';
        }
    })

    return double;

}
Cmint.AppFn.compSetup = function(config) {

    config.custom = config.custom || false;
    config.originalDisplay = config.originalDisplay || config.display;
    config.originalCategory = config.originalCategory || config.category;
    config.markup = config.markup || '';

}
Cmint.AppFn.createCustomComponent = function(customModal) {
    
    customModal.hasError = false;

    var error = Cmint.AppFn.checkCustomName(customModal),
        cloneComp,
        activeComp = Cmint.App.activeComponent;

    // Create customComponents array
    if (!Cmint.App.customComponents) {
        Cmint.App.customComponents = [];
    }

    if (error === 'blank') return;

    // If no duplicates, add new custom component
    if (error === 'pass') {

        activeComp.config.display = customModal.name;
        activeComp.config.category = customModal.category || 'Custom';
        activeComp.config.custom = true;

        cloneComp = Cmint.Util.copyObject(activeComp.config);

        Cmint.App.components.push(cloneComp);
        Cmint.App.customComponents.push(cloneComp);
        Cmint.App.save();

        if (activeComp.config.category === Cmint.App.selectedCategory) {
            Cmint.Bus.$emit('updateComponentList', cloneComp);
        }

        Cmint.Util.debug('added "' + customModal.name + '" ('+customModal.category+') in template "'+Cmint.App.templateName+'"');
        Cmint.AppFn.notify('Custom component "'+customModal.name+'" added!')
        customModal.closeCustom();

    // If duplicate name, render error
    } else {
        customModal.nameError = '"'+customModal.name+'" already exists';
        customModal.name = '';
        customModal.hasError = true;
    }

}
Cmint.AppFn.deleteCustomComponent = function(customModal) {

    var activeComp = Cmint.App.activeComponent;
    var oldName = activeComp.config.display;

    activeComp.config.display = activeComp.config.originalDisplay;
    activeComp.config.category = activeComp.config.originalCategory;
    activeComp.config.custom = false;

    Cmint.AppFn.replaceIndexIf(Cmint.App.components, null, function(item) {
        console.log(customModal.name);
        return item.display === customModal.name;
    }, 'remove')

    Cmint.AppFn.replaceIndexIf(Cmint.App.customComponents, null, function(item) {
        return item.display === customModal.name;
    }, 'remove')

    Cmint.Bus.$emit('deleteCustomComponent', oldName);
    Cmint.Bus.$emit('selectCategory', 'All');
    Cmint.App.save();

    Cmint.Util.debug('deleted custom component "' + customModal.name + '" in template "'+Cmint.App.templateName+'"');
    Cmint.AppFn.notify('Custom component "'+customModal.name+'" deleted')
    customModal.closeCustom();

}
Cmint.AppFn.getComponentMarkup = function(component) {

    var $el = $(component.$el);
    var $clone = $el.clone();
    var $wrap = $('<div></div>');
    $clone.appendTo($wrap);

    // Run component cleanup hooks now
    Cmint.Hooks.runComponentHooks('cleanup', $clone[0], component.config);

    // Run Contentmint system cleanup
    $wrap.find(Cmint.Settings.attr.dataEdit).removeAttr(Cmint.Settings.name.dataEdit)
    $wrap.find(Cmint.Settings.attr.dataTemp).removeAttr(Cmint.Settings.name.dataTemp)
    $wrap.find('[contenteditable]').removeAttr('contenteditable')
    $wrap.find('[spellcheck]').removeAttr('spellcheck')
    $wrap.find(Cmint.Settings.class.component).removeClass(Cmint.Settings.name.component + ' ' + 'active')
    $wrap.find('.mce-content-body').removeClass('mce-content-body');
    $wrap.find('[id]').each(function() {
        if ($(this).attr('id').match(/^mce_\d+/)) $(this).removeAttr('id');
    })
    $wrap.find('[class]').each(function() {
        if ($(this).attr('class') === '') $(this).removeAttr('class');
    })

    var markup = $wrap.html();

    // Run markup hooks now
    Cmint.Hooks.runComponentHooks('markup', markup, component.config);

    Cmint.Util.debug('got markup for component "'+component.config.name+'"');

}
Cmint.AppFn.getTemplateComponents = function(name) {

    var components = [];

    Cmint.Instance.Templates[name].components.forEach(function(comp) {

        var compData = Cmint.Util.copyObject(Cmint.Instance.Components[comp]);

        components.push(compData);

    })

    return components;

}
Cmint.AppFn.mergeCustomComponents = function(data) {
    
    if (data.customComponents.length > 0) {

        data.components = data.components.concat(data.customComponents);
        Cmint.Bus.$emit('updateComponentList', data.components);

    }

}
Cmint.AppFn.notify = function(message) {
    
    var $notify = $(Cmint.Settings.class.notification);
    
    $notify.text(message);
    $notify.addClass('active');
    setTimeout(function() {
        $notify.removeClass('active');
    }, 2500);

}
Cmint.AppFn.refresh = function() {
    
    this.stage = Cmint.Util.copyObject(this.stage);

}
Cmint.AppFn.replaceIndexIf = function(list, data, fn, remove) {

    var index = null;

    list.forEach(function(thing, i) {
        if (fn(thing)) index = i;
    })

    if (index !== null) {
        if (remove === 'remove') {
            list.splice(index, 1);
        } else {
            list.splice(index, 1, data);
        }
    }

}
Cmint.AppFn.save = function() {
    
    var _this = this;

    setTimeout(function() {
        Cmint.Bus.$emit('updateEditorData');

        _this.saved = Cmint.Util.copyObject(_this.stage);
        _this.markup = Cmint.getMarkup();

        Cmint.Hooks.onSaveHook({
            template: Cmint.App.template,
            machineName: Cmint.App.machineName,
            contentName: Cmint.App.contentName,
            username: Cmint.App.username,
            saved: Cmint.App.saved,
            customComponents: Cmint.App.customComponents,
            markup: Cmint.App.markup
        })

        Cmint.AppFn.notify('Saved "'+Cmint.App.contentName+'"');

        Cmint.Util.debug('content saved');
    }, 300);

    

}
// Keeps track of changes made within in the editor as a whole. Note, this does
// not keep track of every tinymce editor instance change, only events directly related
// to components within the system. If you unfocuse an editor instance, that is
// technically a component change since its data is being updated.
Cmint.AppFn.snapshot = function() {

    this.changes++;

    var shot = Cmint.Util.copyObject(this.stage);
    Cmint.Util.debug('took project snapshot (changes: ' + this.changes + ')');

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

    Cmint.Bus.$emit('toolbarDisabler', !this.changes);

}
Cmint.AppFn.undo = function() {
    
    if (this.previous) {
        this.changes--;
        this.stage = this.previous.prior.snapshot;
        Vue.nextTick(Cmint.Drag.updateContainers);
        
        if (this.previous.prior) {
            this.previous = Cmint.Util.copyObject(this.previous.prior);
        } else {
            this.previous = null;
        }
        Cmint.Util.debug('state reverted (current changes: ' + this.changes + ')');
        Cmint.App.save();
    }

    Cmint.Bus.$emit('toolbarDisabler', !this.changes);

}
Cmint.AppFn.updateCustomComponent = function(customModal) {
    
    customModal.hasError = false;

    var error = Cmint.AppFn.checkCustomName(customModal),
        cloneComp,
        activeComp = Cmint.App.activeComponent,
        oldName = activeComp.config.display;

    if (error === 'blank') return;

    activeComp.config.oldCustomName = oldName;
    activeComp.config.display = customModal.name;
    activeComp.config.category = customModal.category || 'Custom';
    // activeComp.config.custom = true;

    cloneComp = Cmint.Util.copyObject(activeComp.config);

    Cmint.AppFn.replaceIndexIf(Cmint.App.components, cloneComp, function(item) {
        return item.display === oldName;
    })

    Cmint.AppFn.replaceIndexIf(Cmint.App.customComponents, cloneComp, function(item) {
        return item.display === oldName;
    })

    if (activeComp.config.category === Cmint.App.selectedCategory) {
        Cmint.Bus.$emit('selectCategory', Cmint.App.selectedCategory);
    }

    Cmint.Bus.$emit('updateCustom', cloneComp);

    Cmint.App.save();

    

    Cmint.Util.debug('updated custom component "' + customModal.name + '" in template "'+Cmint.App.templateName+'"');
    Cmint.AppFn.notify('Custom component "'+customModal.name+'" updated')
    customModal.closeCustom();

}
Cmint.AppFn.updateStageCustomComponents = function(component) {
    
    if (component.config.custom && component.environment === 'stage') {
        Cmint.Bus.$on('updateCustom', function(data) {
            if (component.config.display === data.oldCustomName) {
                Cmint.Util.debug('updated staged custom component');
                vmData = Cmint.Sync.getVmContextData(component.config.index, Cmint.App.stage);
                vmData.context.splice(vmData.index, 1, Cmint.Util.copyObject(data));
            }
        })
    }

}
Cmint.Util.runTests();

Cmint.Init = function() {

    // Get user data from textarea. The textarea is populated by whatever backend
    // the project happens to be using.
    Cmint.Instance.Data = JSON.parse($('#Data').text());

    // Fetch the template markup using a jquery ajax call. The callback will initiate the main
    // Vue instance.
    var template = Cmint.Instance.Data.template;
    $.get(Cmint.Instance.Templates[template].path, function(markup) {

        Cmint.App = new Vue({

            el: '#App',

            data: {

                templateMarkup: markup, // Does not get pushed on save
                template: Cmint.Instance.Data.template,
                templateName: Cmint.Instance.Data.template,

                username: Cmint.Settings.config.username ? Cmint.Instance.Data.username : '',
                machineName: Cmint.Instance.Data.machineName,
                contentName: Cmint.Instance.Data.contentName,
                customComponents: Cmint.Instance.Data.customComponents,
                markup: '',
                
                // Contexts
                stage: [],
                components: Cmint.AppFn.getTemplateComponents(template),

                // Global items used by other components
                activeComponent: null,
                fieldsComponent: null,
                fieldsMountOnly: false,
                componentList: null,
                selectedCategory: 'All',

                // Introspection
                contextualize: false,
                changes: 0,
                previous: null,
                saved: [],
                initialState: Cmint.Util.copyObject(Cmint.Instance.Data.saved)
            
            },

            methods: {

                save: Cmint.AppFn.save,
                snapshot: Cmint.AppFn.snapshot,
                undo: Cmint.AppFn.undo,
                refresh: Cmint.AppFn.refresh

            },

            created: function() {
                Cmint.AppFn.mergeCustomComponents(this);
            },

            mounted: function() {
                var _this = this;
                Cmint.Bus.$on('callComponentFields', function() {
                    _this.fieldsComponent = _this.activeComponent.config;
                })
                this.initialState.forEach(function(comp) {
                    _this.stage.push(comp);
                })
                Cmint.Ui.documentHandler();
                Cmint.Ui.contextualize();
                Cmint.Bus.setSelectedCategory(this);
                Cmint.Drag.init();
                Cmint.Util.debug('mounted application');

                if (this.initialState.length) {
                    this.previous = {
                        snapshot: this.initialState
                    }
                }

                Cmint.Bus.$emit('renderUsernameLink', this.username);

                setTimeout(function() {
                    Cmint.Drag.fn.updateContainers();
                }, 1000)

            }

        })

    })

}