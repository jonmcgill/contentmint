Cmint.createComponent({
    template: '\
        <comp :config="config" :style="{\
            background: config.fields.output.bg,\
            padding: config.fields.output.padding,\
            \'font-family\': config.css.fontFam,\
            color:config.fields.output.color}"\
            data-edit="text">\
        </comp>',
    config: {
        name: 'heading',
        display: 'Heading',
        category: 'Content',
        css: {
            fontfam: 'sans-serif'
        },
        tokens: [{'text': 'text'}, {'bg': 'bg'}],
        content: { text: '<h1 style="font-family:sans-serif;">Lorem Ipsum Headingum</h1>' },
        fields: {
            output: { color: '', bg: '', padding: '' },
            list: [
                { name: 'color', result: 'color' },
                { name: 'bg-color', result: 'bg' },
                { name: 'padding', result: 'padding' }
            ]
        }
    }
})