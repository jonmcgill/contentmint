Cmint.Util.runTests();

Cmint.Init = function() {


    Cmint.App = new Vue({

        el: '#App',

        data: {
            
            stage: [{
                name: 'heading',
                display: 'Heading',
                category: 'Content',
                tags: { root: 'h1' },
                content: { text: 'Lorem Ipsum Headingum' }
            }],

            components: [],

            changes: 0,

            username: 'mcgilljo',

            contentName: 'My Content Name'
        
        },

        methods: {},

        mounted: function() {
            Cmint.Util.debug('mounted application');
        }

    })

}