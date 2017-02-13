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
        store: '[{"name":"heading","display":"Title","content":"<div style=\\"font-family: Arial,sans-serif; font-size: 2.4em;\\">TODO</div>"},{"name":"body-copy","display":"Body Copy","content":"<ul>\\n<li style=\\"margin-bottom: 1.2em;\\">Create field-choice for conditional fields</li>\\n<li style=\\"margin-bottom: 1.2em;\\">Create field token system</li>\\n<li style=\\"margin-bottom: 1.2em;\\">Add field and fieldgroup required indicators</li>\\n<li style=\\"margin-bottom: 1.2em;\\">Work with tinymce on pasting Word content</li>\\n<li style=\\"margin-bottom: 1.2em;\\">Work on preview view</li>\\n<li style=\\"margin-bottom: 1.2em;\\">Work on cleaning and prepping markup for emails</li>\\n<li style=\\"margin-bottom: 1.2em;\\">Work on template display</li>\\n</ul>"}]',
        thumbnails: [
            componentDefaults['heading'],
            componentDefaults['body-copy'],
            componentDefaults['table-row'],
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