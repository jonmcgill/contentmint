Cmint.Util.runTests();

Cmint.Init = function() {


    Cmint.App = new Vue({

        el: '#App',

        data: {

            // User Data
            template: '<div class="template-test">{{ stage }}</div>',
            username: 'mcgilljo',
            contentName: 'My Content Name',
            
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

            save: Cmint.AppFn.save,
            snapshot: Cmint.AppFn.snapshot,
            undo: Cmint.AppFn.undo

        },

        mounted: function() {
            Cmint.Ui.documentHandler();
            Cmint.Ui.contextualize();
            Cmint.Drag.init();
            Cmint.Util.debug('mounted application');
        }

    })

}