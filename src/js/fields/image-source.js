Cmint.createField({
    name: 'image-source',
    config: {
        type: 'field-text',
        display: 'Image URL',
        label: 'Image URL Address',
        input: 'url',
        help: 'Absolute path including http(s)://',
        check: /^https*:\/\/.+(\.[a-zA-Z]+)$/g,
        hook: 'test'
    }
})