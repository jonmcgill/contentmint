Cmint.createComponent({
    template: '<div data-editor v-html="config._content.copy"></div>',
    config: {
        _name: 'body-copy',
        _display: 'Body Copy',
        _category: 'Content',
        _content: {
            copy: '<p>This is some lorem ipsum</p>'
        }
    }
})