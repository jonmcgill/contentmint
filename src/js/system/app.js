Cmint.init = function(data) {

    Data = data || false;
    if (!Data) throw 'Contentmint cannot run without data';

    $.get(Data.templatePath, function(markup) {
        
        var stage, templateComponents, customComponents = [];

        stage = '<context id="Stage" data-context-name="stage" :children="stage"></context>';
        Data.markup = markup.replace(/\{\{\s*stage\s*\}\}/, stage);
        $('#Template').html(Data.markup);

        if (Data.customComponents.hasOwnProperty(Data.template)) {
            customComponents = Util.copy(Data.customComponents[Data.template]);
        }

        templateComponents = Cmint.setAvailableComponents(Templates[Data.template]).concat(customComponents);
        

        Cmint.app = new Vue({

            el: '#App',

            data: {
                Data: Data,
                components: templateComponents,
                stage: [],
                saved: Data.saved,

                username: Data.username,
                contentName: Data.contentName,

                fieldsComponent: null,
                focusedComponent: null,
                contextualize: false,
                
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
                this.$bus.$on('contextualize', function() {
                    _this.contextualize = !_this.contextualize;
                })

                Util.debug('mounted app');
                $('#Loading').remove();

            }

        })

    })
}