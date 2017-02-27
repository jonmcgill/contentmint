Cmint.createComponent({
    template: '<section data-edit="copy" :style="config._css"></section>',
    config: {
        _name: 'body-copy',
        _display: 'Body Copy',
        _category: 'Content',
        _tag: 'article',
        _content: {
            copy: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent non lectus id quam congue egestas. Pellentesque ullamcorper pretium tortor vitae vehicula. Vivamus lacinia porttitor libero. Nulla vulputate vel libero id blandit.</p>'
        },
        _css: {
            'line-height': '1.6'
        }
    }
})