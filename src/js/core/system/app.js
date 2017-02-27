$.getJSON('test/test-data.json', function(data) {

    Data = data;

    $.get('/templates/' + Data.template + '.html', function(markup) {
        
        var stage = '<context id="Stage" data-context-name="stage" :children="stage"></context>';
        Data.markup = markup.replace(/\{\{\s*stage\s*\}\}/, stage);
        $('#Template').html(Data.markup);

        Cmint.app = new Vue({

            el: '#App',

            data: {
                components: Cmint.setAvailableComponents(Templates[Data.template]),
                stage: [],
                saved: Data.saved,

                username: Data.username,
                contentName: Data.contentName,

                fieldsComponent: null,
                focusedComponent: null,
                showLayout: false,
                
                changes: null,
                previous: null,
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

                Cmint.fireDocHandlers();

                var _this = this;
                this.$bus.$on('callComponentFields', function() {
                    _this.fieldsComponent = _this.focusedComponent.config;
                })
                this.$bus.$on('showLayout', function() {
                    _this.showLayout = !_this.showLayout;
                })

                Util.debug('mounted app');
                $('#Loading').remove();

            }

        })

    })

})