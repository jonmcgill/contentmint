Cmint.createComponent({
    template: '\
        <comp :config="config">\
            <div data-edit="copy" :style="config.css"></div><br>\
        </comp>',
    config: {
        name: 'body-copy',
        display: 'Body Copy',
        category: 'Content',
        css: {
            'color': '#231f20',
            'line-height': '20px',
            'font-size': '14px',
            'font-family': 'sans-serif',
        },
        content: {
            copy: '<p>This is some default text and I could have used Lorem, but I decided to use this instead. And what is this? It is a rambling, a muse, an attempt to fool you into thinking there is legitimate copy here when there actually isn\'t. And honestly, what is legitimate copy, anyways?</p>'
        }
    }
})