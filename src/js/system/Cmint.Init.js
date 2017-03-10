Cmint.Util.runTests();

Cmint.Init = function() {

    // Get user data from textarea. The textarea is populated by whatever backend
    // the project happens to be using.
    Cmint.Instance.Data = JSON.parse($('#Data').text());

    // Fetch the template markup using a jquery ajax call. The callback will initiate the main
    // Vue instance.
    var template = Cmint.Instance.Data.template;
    $.get(Cmint.Instance.Templates[template].path, function(markup) {

        Cmint.App = new Vue({

            el: '#App',

            data: {

                templateMarkup: markup, // Does not get pushed on save
                template: Cmint.Instance.Data.template,
                templateName: Cmint.Instance.Data.template,

                username: Cmint.Instance.Data.username,
                machineName: Cmint.Instance.Data.machineName,
                contentName: Cmint.Instance.Data.contentName,
                customComponents: Cmint.Instance.Data.customComponents,
                markup: '',
                
                // Contexts
                stage: Cmint.Instance.Data.saved,
                components: Cmint.AppFn.getTemplateComponents(template),

                // Global items used by other components
                activeComponent: null,
                fieldsComponent: null,
                fieldsMountOnly: false,
                componentList: null,
                selectedCategory: 'All',

                // Introspection
                contextualize: false,
                changes: 0,
                previous: null,
                saved: []
            
            },

            methods: {

                save: Cmint.AppFn.save,
                snapshot: Cmint.AppFn.snapshot,
                undo: Cmint.AppFn.undo,
                refresh: Cmint.AppFn.refresh

            },

            created: function() {
                Cmint.AppFn.mergeCustomComponents(this);
            },

            mounted: function() {
                var _this = this;
                Cmint.Bus.$on('callComponentFields', function() {
                    _this.fieldsComponent = _this.activeComponent.config;
                })
                Cmint.Ui.documentHandler();
                Cmint.Ui.contextualize();
                Cmint.Bus.setSelectedCategory(this);
                Cmint.Drag.init();
                Cmint.Util.debug('mounted application');
            }

        })

    })

}