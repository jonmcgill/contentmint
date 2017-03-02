var Cmint = Cmint || (function() {

    'use strict';

    return {

        // The main Vue instance
        App: null,

        // API methods for main vue instance
        AppFn: {},

        // Manages application events
        Bus: new Vue(),

        // Manages drag and drop with dragula.js
        Drag: {},

        // Manages WYSYWIG editing with TinyMCE
        Editor: {
            config: null,
            types: {}
        },

        // API for field system
        Fields: {},

        // Global settings and names
        G: {},

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
        Ui: {},

        // Helper functions
        Util: {}

    }

})();
Cmint.G = {

    config: {
        debug_on: true
    },

    name: {
        component: 'Component',
        context: 'Context',
        dataHook: 'data-hook',
        dataContext: 'data-context'
    },

    class: {
        component: '.Component',
        context: '.Context'
    },

    attr: {
        dataContext: '[data-context]',
        dataHook: '[data-hook]'
    }

}
// Assigns Bus to the Vue prototype and makes it available to all subsequent components
// https://devblog.digimondo.io/building-a-simple-eventbus-in-vue-js-64b70fb90834#.2s62ry2rp
Object.defineProperties(Vue.prototype, {
    $bus: {
        get: function() {
            return Bus;
        }
    }
})
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
    if (Cmint.G.debug_on) {
        console.log('DEBUG: ' + message);
    }
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
    parentContext = $(element).closest(Cmint.G.class.context);
    parentComponent = $(element).parent().closest(Cmint.G.class.component);
    name = parentContext.attr(Cmint.G.name.dataContext);
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

    var stage = $('<div class="'+Cmint.G.name.context+'" '+Cmint.G.name.dataContext+'="stage"></div>');
    var compParent = $('<div class="'+Cmint.G.name.component+'"></div>');
    var context = $('<div class="'+Cmint.G.name.context+'" '+Cmint.G.name.dataContext+'="foo"></div>');
    var compChild = $('<div class="'+Cmint.G.name.component+'"></div>');

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

    // remove the first item since that is provided by the environment
    position.shift();

    position.forEach(function(key, i) {
        data = data[key];
    })

    return data;

}

Cmint.Util.test('Cmint.Sync.getComponentData', function() {

    var environment = {foo: [ 
        null,
        { bar: [
            null,
            { baz: 'tada'}
        ]}
    ]}
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
        _context = context;

    position.forEach(function(key, i) {
        if (i === (position.length - 1)) {
            output = {
                context: _context,
                index: key
            }
        } else {
            _context = _context[key]; 
        }
    })

    return output;

}

Cmint.Util.test('Cmint.Sync.getVmContextData', function() {

    var context = {
        foo: [null, {
            bar: [null, {
                baz: 'tada'
            }
        ]}
    ]}
    var position = ['foo', 1, 'bar', 1];
    var expected = { 
        context: [null, {baz: 'tada'}],
        index: 1
    }
    var got = Cmint.Sync.getVmContextData(position, context);
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
            { biz: 'boo' },
            { bar: [
                { buz: 'byz' },
                { baz: 'tada' }
            ]}
        ]}
    var position = ['foo', 1, 'bar', 2];
    var data = { beez: 'bundle' };
    var expected = {
        foo: [
            { biz: 'boo' },
            { bar: [
                { buz: 'byz' },
                { baz: 'tada' },
                { beez: 'bundle' }
            ]}
        ]}
    var got = Cmint.Sync.insertVmContextData(position, data, context);
    var result = _.isEqual(expected, got);

    return [result, expected, got];

})
Cmint.Util.runTests();