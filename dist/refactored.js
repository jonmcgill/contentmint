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
            Fields: {},
            Hooks: {},
            Menus: {},
            Processes: {},
            Templates: {}
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
Cmint.Util.Tests = [];

Cmint.Util.test = function(name, fn) {
    Cmint.Util.Tests.push({
        name: name,
        fn: fn
    })
}

Cmint.Util.runTests = function() {
    Cmint.Util.Tests.forEach(function(test) {
        var result = test.fn();
        console.log('TEST: ' + test.name + ' --> ' + result);
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

    var expects = ['stage', 0, 'foo', 0];
    
    return _.isEqual(Cmint.Sync.getStagePosition(compChild[0]), expects) ? 'Passed' : 'Failed';

})
Cmint.Util.runTests();