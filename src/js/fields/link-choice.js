Cmint.createField({
    name: 'link-choice',
    config: {
        type: 'field-choice',
        display: 'Link Type',
        label: 'Link Type',
        input: 'selected-field',
        choices: [
            {   name: 'link-url',
                result: 'link'    },
            {   name: 'link-mailto',
                result: 'link'   }
        ]
    }
})