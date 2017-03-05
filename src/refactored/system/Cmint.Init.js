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
                    css: {
                        fontfam: 'sans-serif'
                    },
                    tokens: [{'text': 'text'}, {'bg': 'bg'}],
                    content: { text: 'Lorem Ipsum Headingum', 'link-text': 'email@here' },
                    fields: {
                        output: { color: 'red', bg: '', padding: '', href: '' },
                        list: [
                            { name: 'color', result: 'color' },
                            { name: 'bg-color', result: 'bg' },
                            { name: 'padding', result: 'padding' },
                            { name: 'link-choice', result: 'href' }
                        ]
                    }
                },
                {
                    name: 'body-copy',
                    display: 'Body Copy',
                    category: 'Content',
                    css: {
                        'line-height': '1.7',
                        'font-family': 'sans-serif',
                        'font-size': '1.15em'
                    },
                    content: {
                        copy: '<div>This is some default text and I could have used Lorem, but I decided to use this instead. And what is this? It is a rambling, a muse, an attempt to fool you into thinking there is legitimate copy here when there actually isn\'t. And honestly, what is legitimate copy, anyways?</div>'
                    }
                },
                {
                    name: 'container',
                    display: 'Empty Container',
                    category: 'Layout',
                    contexts: {
                        container: []
                    },
                    fields: {
                        output: { padding: '', centerblock:'', maxwidth: '' },
                        list: [
                            {name: 'padding', result: 'padding'},
                            {name: 'align-block', result: 'centerblock' },
                            {name: 'max-width', result: 'maxwidth'}
                        ]
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