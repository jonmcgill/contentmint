Cmint.Util.runTests();

Cmint.Init = function() {


    Cmint.App = new Vue({

        el: '#App',

        data: {
            
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

            componentList: null,

            changes: 0,

            username: 'mcgilljo',

            contentName: 'My Content Name',

            activeComponent: null,

            fieldsComponent: null,

            template: '<div class="template-test">{{ stage }}</div>'
        
        },

        methods: {},

        mounted: function() {
            Cmint.Ui.documentHandler();
            Cmint.Drag.init();
            Cmint.Util.debug('mounted application');
        }

    })

}