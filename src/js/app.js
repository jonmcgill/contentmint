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
        store: '[{"name":"heading","display":"Title","content":"<div style=\\"font-family: Arial,sans-serif; font-size: 2.4em;\\">TODO</div>"},{"name":"body-copy","display":"Body Copy","content":"<ul><div style=\\"text-align: center;\\" data-mce-style=\\"text-align: center;\\"><strong>Phase 1</strong><br data-mce-bogus=\\"1\\"></div><li style=\\"margin-bottom: 1.2em;\\">Fix the bug with alt input in banner component</li><li style=\\"margin-bottom: 1.2em;\\">Implement auto save</li><li style=\\"margin-bottom: 1.2em;\\">Make overlay on stage area when in field view</li><li style=\\"margin-bottom: 1.2em;\\">Style the loading graphic</li><li style=\\"margin-bottom: 1.2em;\\">Think of a better stage component hover state</li><li style=\\"margin-bottom: 1.2em;\\">Work on content pasted from Word</li><li style=\\"margin-bottom: 1.2em;\\">Create preview view mode</li><li style=\\"margin-bottom: 1.2em;\\">Implement code cleaning</li><li style=\\"margin-bottom: 1.2em;\\">Think through how to display different templates and tie specific components to those templates</li><li style=\\"margin-bottom: 1.2em;\\">Create dashboard view</li><li style=\\"margin-bottom: 1.2em;\\">Create user login/logout/password reset views</li></ul>"}]',
        thumbnails: [
            componentDefaults['heading'],
            componentDefaults['body-copy'],
            componentDefaults['table-data'],
            componentDefaults['two-column'],
            componentDefaults['banner']
        ],
        toolbar: { config: false },
        activeComponent: false,
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
        fireDocumentHandlers(this);
        $('.thumbnail').on('mouseenter mouseleave', function() {
            $(this).toggleClass('hovered');
        })
        $('#Toolbar button').click(function() {
            var btn = $(this);
            if (btn.hasClass('btn-clone')) _this.toolbar.copy();
            if (btn.hasClass('btn-trash')) _this.toolbar.trash();
            if (btn.hasClass('btn-settings')) _this.toolbar.openSettings();
        })
        if (this.store) this.refresh();
    }
})
