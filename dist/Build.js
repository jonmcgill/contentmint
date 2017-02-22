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
            Components[options.config._name] = options.config;
            Vue.component(options.config._name, {
                props: ['config'],
                template: options.template
            })
        }
    }

    function createField(options) {
        if (Fields[options.name]) {
            throw 'Field already exists';
        } else {
            Fields[options.name] = options.config;
        } 
    }

    function setAvailableComponents() {
        return Util.jprs($('#AvailableComponents').text());
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
        \</div>'
})
var Components = {};
Cmint.createComponent({
    template: '\
        <a v-if="config._fields.output.link" :href="config._fields.output.link">\
            <img :src="config._fields.output.source" width="50%" /></a>\
        <img v-else :src="config._fields.output.source" width="50%" />',
    config: {
        _name: 'banner-image',
        _display: 'Banner Image',
        _tokens: [
            { 'URL': 'link' }
        ],
        _fields: {
            output: {
                source: '',
                link: 'http://scoopit.co.nz/static/images/default/placeholder.gif'
            },
            list: [
                {   name: 'image-source',
                    result: 'source'    },
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
        _display: 'Container'
    }
})
Cmint.createComponent({
    template: '<h3 class="thing" v-text="config._index + \' (\'+_uid+\')\'" :style="config.css"></h3>',
    config: {
        _name: 'thing',
        _display: 'Thing'
    }
})
var Fields = {};
Cmint.createField({
    name: 'image-source',
    config: {
        type: 'field-text',
        label: 'Write in an image URL',
        input: 'url'   
    }
})
Vue.component('field-text', {
    props: ['field', 'component'],
    // We've put a layer between the component's data tied to the DOM and the data entered
    // into the field. This is because some fields need to process the input in order to
    // deliver the final output to the vm data.
    // The input element is bound to the field's input data. On the input event, the data
    // in the input is processed and sent to the designated component._fields.output key.
    // During processing, if the component has tokens defined, the input will be run through
    // Cmint.tokenize().
    template:'\
        <div class="field-instance">\
            <label>{{ field.label }}</label>\
            <input type="text" v-model="field.inputs[fields[field.name].input]" @input="process()" />\
        </div>',
    data: function() { return {
        fields: Fields
    }},
    methods: {
        process: _.debounce(function() {
            var result = this.component._fields.output[this.field.result];
            var fieldData = Fields[this.field.name];
            var input = this.field.inputs[fieldData.input];
            if (this.component._tokens) {
                input = Cmint.tokenize(input, this.component);
            }
            this.component._fields.output[this.field.result] = input;
        }, 500)
    },
    mounted: function() {
        this.process();
    }

})
Vue.component('field', {
    props: ['field', 'component'],
    template: '\
        <div class="field-wrap">\
            <component :is="field.type" :field="field" :component="component"></component>\
        </div>',
    beforeMount: function() {
        // result = default output listed in component
        var result = this.component._fields.output[this.field.result];
        // field instances aren't components; they're object literals passed to field components
        var fieldData = Fields[this.field.name];
        this.field.label = fieldData.label;
        this.field.type = fieldData.type;
        // if no inputs, this is the first instantiation of this field for a given component.
        // inputs are established based on the defaults provided to the fieldData and the components
        if (!this.field.inputs) {
            this.field.inputs = {};
            this.field.inputs[fieldData.input] = result;
        }
    }
})
Vue.component('fields', {
    props: ['component'],
    template: '\
        <div class="fields-container">\
            <field v-for="field in component._fields.list" :field="field" :component="component"></field>\
        </div>'
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
    Util.debug('showing fields for ' + component._name);
    this.fieldsComponent = component;
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
Cmint.app = new Vue({

    el: '#App',

    data: {
        components: [],
        stage: [],
        saved: [],

        fieldsComponent: null,
        changes: null,
        previous: null,

        test: Components['banner-image'],
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
        this.components = Cmint.setAvailableComponents();
        Util.debug('mounted app');
    }

})