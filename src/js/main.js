//
//  src/js/main.js
//
var app = new Vue({
    el: '#App',
    data: {
        thumbnails: [
            componentDefaults['body-copy'],
            componentDefaults['two-column']
        ],
        stage: [],
        store: '',
        saved: ''
    },
    methods: {
        save: function() {
            this.saved = JSON.stringify(collectData());
        },
        empty: function() {
            this.stage = [];
            $(g.id.stage).empty();
        },
        load: function() {
            var _this = this;
            _this.empty();
            Vue.nextTick(function() {
                _this.stage = JSON.parse(_this.store);
            })
        }
    },
    mounted: function() {
        $(g.id.loading).remove();
    }
})