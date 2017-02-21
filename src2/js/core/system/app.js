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
        this.components = Cmint.displayOnLoad();
        Util.debug('mounted app');
    }

})