Cmint.Util.runTests();

Cmint.Init = function() {


    Cmint.App = new Vue({

        el: '#App',

        data: {

            // User Data for testing
            template: '<div class="template-test">{{ stage }}</div>',
            templateName: 'test-template',
            username: 'mcgilljo',
            contentName: 'My Content Name',
            // For testing = UserData.customComponents['templateName']
            customComponents: [],
            
            // Contexts
            stage: [],
            components: [
                {
                    name: 'heading',
                    display: 'Heading',
                    category: 'Content',
                    tokens: [{'text': 'text'}],
                    content: { text: 'Lorem Ipsum Headingum' },
                    fields: {
                        output: { color: 'red' },
                        list: [{ name: 'color', result: 'color' }]
                    }
                },
                {
                    name: 'container',
                    display: 'Empty Container',
                    category: 'Layout',
                    contexts: {
                        container: []
                    }
                }
            ],

            // Global items used by other components
            activeComponent: null,
            fieldsComponent: null,
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
            undo: Cmint.AppFn.undo

        },

        created: function() {
            Cmint.AppFn.mergeCustomComponents(this);
        },

        mounted: function() {
            var _this = this;
            this.$bus.$on('callComponentFields', function() {
                _this.fieldsComponent = _this.activeComponent.config;
            })
            Cmint.Ui.documentHandler();
            Cmint.Ui.contextualize();
            Cmint.Bus.setSelectedCategory(this);
            Cmint.Drag.init();
            Cmint.Util.debug('mounted application');
        }

    })

}