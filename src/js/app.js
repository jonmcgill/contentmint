//
//  src/js/main.js
//
var app = new Vue({
    el: '#App',
    data: {
        contentName: 'Content Name Goes Here',
        fieldsOpen: false,
        saved: '',
        stage: [],
        store: '[{"name":"heading","display":"Title","content":"<div style=\\"font-family: Arial,sans-serif; font-size: 2.4em;\\">TODO</div>"},{"name":"body-copy","display":"Body Copy","content":"<ul><li style=\\"margin-bottom: 1.2em;\\">Work with tinymce on pasting Word content</li><li style=\\"margin-bottom: 1.2em;\\">Work on preview view</li><li style=\\"margin-bottom: 1.2em;\\">Work on cleaning and prepping markup for emails</li><li style=\\"margin-bottom: 1.2em;\\">Work on template display</li><li style=\\"margin-bottom: 1.2em;\\">Create dashboard view</li><li style=\\"margin-bottom: 1.2em;\\">Create user login/logout/password reset views</li></ul>"}]',
        thumbnails: [
            componentDefaults['heading'],
            componentDefaults['body-copy'],
            componentDefaults['table-data'],
            componentDefaults['two-column'],
            componentDefaults['banner']
        ],
        trash: [],
        username: 'mcgilljo'
    },
    methods: {
        save: function() {
            this.saved = JSON.stringify(getStageData());
        },
        collect: function() {
            this.store = JSON.stringify(getStageData());
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
        var _this = this;
        $(g.id.loading).remove();
        fireDocumentHandlers();
        $('.thumbnail').on('mouseenter mouseleave', function() {
            $(this).toggleClass('hovered');
        })
        if (this.store) this.refresh();
    }
})