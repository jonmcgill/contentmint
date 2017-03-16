// type, display, label, input, help*, check*, processes*
Cmint.createField({
    name: 'img-proportions',
    config: {
        type: 'field-text',
        display: 'Image Width',
        label: 'Image Width',
        input: 'imgwidth',
        help: 'Number of pixels (full width = 550)',
        processes: ['img-proportions']
    }
})