Cmint.createField({
    name: 'image-source',
    config: {
        type: 'field-text',
        label: 'Write in an image URL',
        input: 'url',
        help: 'Absolute path including http(s)://',
        check: /^https*:\/\/.+(\.[a-zA-Z]+)$/g,
        hook: 'test'
    }
})