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

                username: Cmint.Settings.config.username ? Cmint.Instance.Data.username : '',
                machineName: Cmint.Instance.Data.machineName,
                contentName: Cmint.Instance.Data.contentName,
                customComponents: Cmint.Instance.Data.customComponents,
                markup: '',
                
                // Contexts
                stage: [],
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
                saved: [],
                initialState: Cmint.Util.copyObject(Cmint.Instance.Data.saved)
            
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

            // This stuff probably needs to be cleaned up a little bit
            mounted: function() {
                var _this = this;
                Cmint.Bus.$on('callComponentFields', function() {
                    _this.fieldsComponent = _this.activeComponent.config;
                })
                this.initialState.forEach(function(comp) {
                    _this.stage.push(comp);
                })
                Cmint.Ui.documentHandler();
                Cmint.Ui.contextualize();
                Cmint.Bus.setSelectedCategory(this);
                Cmint.Drag.init();
                Cmint.Util.debug('mounted application');

                if (this.initialState.length) {
                    this.previous = {
                        snapshot: this.initialState
                    }
                }

                this.markup = Cmint.getMarkup(this.stage);

                Cmint.Bus.$emit('renderUsernameLink', this.username);

                setTimeout(function() {
                    Cmint.Drag.fn.updateContainers();
                }, 1000)

            }

        })

    })

}