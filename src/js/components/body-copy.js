Cmint.createComponent({
    template: '<div data-edit="copy"\
                    data-hook="vertical-space"\
                    style="color:#231f20; font-family:Arial, sans-serif; font-size:16px; text-align:left; line-height: 24px;"></div>',
    config: {
        _name: 'body-copy',
        _display: 'Body Copy',
        _category: 'Content',
        _tag: 'article',
        _content: {
            copy: '<span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent non lectus id quam congue egestas. Pellentesque ullamcorper pretium tortor vitae vehicula. Vivamus lacinia porttitor libero. Nulla vulputate vel libero id blandit.</span>'
        },
        _css: {
            'line-height': '1.6'
        }
    }
})