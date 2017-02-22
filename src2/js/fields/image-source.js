Cmint.createField({
    name: 'image-source',
    config: {
        type: 'field-text',
        display: 'Image URL',
        label: 'Write in an image URL (field-text)',
        input: 'url',
        help: 'Absolute path including http(s)://',
        check: /^https*:\/\/.+(\.[a-zA-Z]+)$/g,
        hook: 'test'
    }
})