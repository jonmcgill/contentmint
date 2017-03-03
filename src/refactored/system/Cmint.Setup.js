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

        // API for field system
        Fields: {},

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