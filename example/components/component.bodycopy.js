Cmint.createComponent({
    template: '<comp :config="config" data-edit="copy" :style="config.css"></comp>',
    config: {
        name: 'body-copy',
        display: 'Body Copy',
        category: 'Content',
        css: {
            'line-height': '1.7',
            'font-family': 'sans-serif',
            'font-size': '1.05em'
        },
        content: {
            copy: '<div>This is some default text and I could have used Lorem, but I decided to use this instead. And what is this? It is a rambling, a muse, an attempt to fool you into thinking there is legitimate copy here when there actually isn\'t. And honestly, what is legitimate copy, anyways?</div>'
        }
    }
})