Cmint.createComponent({
    template: '\
        <comp :config="config">\
            <div :style="{\
                background: config.fields.output.bg,\
                padding: config.fields.output.padding,\
                color:config.fields.output.color,\
                \'font-family\': config.css.fontfam,\
                \'font-size\': config.css.fontsize,\
                \'font-weight\': config.css.fontweight,\
                \'line-height\': config.css.lineheight}"\
                data-edit="text"></div>\
            <br>\
        </comp>',
    config: {
        name: 'heading',
        display: 'Heading',
        category: 'Content',
        css: {
            fontfam: 'Arial, sans-serif',
            fontsize: '24px',
            fontweight: 'bold',
            lineheight: 'normal'
        },
        tokens: [{'text': 'text'}, {'bg': 'bg'}],
        content: { 
            text: '<div>Lorem Ipsum Headingum</div>'
        },
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