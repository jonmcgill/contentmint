Cmint.createComponent({
    template: '\
        <comp :config="config" :style="{\
            padding:config.fields.output.padding,\
            \'max-width\': config.fields.output.maxwidth,\
            margin: config.fields.output.centerblock\
        }">\
            <context :contexts="config.contexts.container" data-context="container"></context>\
        </comp>',
    config: {
        name: 'container',
        display: 'Empty Container',
        category: 'Layout',
        contexts: {
            container: []
        },
        hooks: ['vertical-space'],
        fields: {
            output: { padding: '', centerblock:'', maxwidth: '' },
            list: [
                {name: 'padding', result: 'padding'},
                {name: 'align-block', result: 'centerblock' },
                {name: 'max-width', result: 'maxwidth'}
            ]
        }
    }
})