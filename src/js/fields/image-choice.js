Cmint.createField({
    name: 'image-choice',
    config: {
        type: 'field-choice',
        display: 'Image Input Type',
        label: 'Image Input Type',
        input: 'selected-field',
        choices: [
            {   name: 'image-source',
                result: 'source'    },
            {   name: 'image-presets',
                result: 'source'   },
            {   name: 'image-choice',
                result: 'source'    }
        ]
    }
})