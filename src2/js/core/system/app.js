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
                Util.debug('mounted app');
            }

        })

    })

})