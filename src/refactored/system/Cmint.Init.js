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
            customComponents: [
                {
                    name: 'container',
                    display: 'My Component',
                    category: 'Blocks',
                    contexts: {
                        container: [
                            {
                                name: 'heading',
                                display: 'Heading',
                                category: 'Content',
                                tags: { root: 'h1' },
                                content: { text: 'Custom Article Title in Container' }
                            }
                        ]
                    }
                }
            ],
            
            // Contexts
            stage: [],
            components: [
                {
                    name: 'heading',
                    display: 'Heading',
                    category: 'Content',
                    tags: { root: 'h1' },
                    content: { text: 'Lorem Ipsum Headingum' }
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

            // Introspection
            contextualize: false,
            changes: 0,
            previous: null,
            saved: []
        
        },

        methods: {

            // callFields: null
            save: Cmint.AppFn.save,
            snapshot: Cmint.AppFn.snapshot,
            undo: Cmint.AppFn.undo,
            mergeCustom: Cmint.AppFn.mergeCustomComponents

        },

        mounted: function() {
            this.mergeCustom();
            Cmint.Ui.documentHandler();
            Cmint.Ui.contextualize();
            Cmint.Drag.init();
            Cmint.Util.debug('mounted application');
        }

    })

}