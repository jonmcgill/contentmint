Cmint.createField({
    name: 'link-url',
    config: {
        type: 'field-text',
        display: 'Link',
        label: 'Link URL',
        input: 'link',
        help: 'Absolute path including http(s)://',
        check: /^https*:\/\/.+/g,
    }
})