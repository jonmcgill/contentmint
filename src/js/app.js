//
//  src/js/main.js
//
var app = new Vue({
    el: '#App',
    data: {
        contentName: 'Content Name Goes Here',
        stage: [],
        store: '',
        saved: '',
        thumbnails: [
            componentDefaults['body-copy'],
            componentDefaults['two-column']
        ],
        trash: [],
        username: 'User Name'
    },
    methods: {
        save: function() {
            this.saved = JSON.stringify(collectData());
        },
        collect: function() {
            this.store = JSON.stringify(collectData());
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
        $(g.id.loading).remove();
        $('.thumbnail').on('mouseenter mouseleave', function() {
            $(this).toggleClass('hovered');
        })
    }
})