//
//  src/js/fieldData.js
//
var fieldData = {
    'image-dropdown': {
        label: 'Select a preset image',
        result: 'src',
        type: {
            name: 'dropdown',
            menu: 'images',
            selected: 'Default'
        }
    },
    'image-url': {
        label: 'Write in an image URL',
        result: 'src',
        type: { name: 'text' }
    },
    'alt-text': {
        label: 'Add image alt text',
        result: 'alt',
        type: { name: 'text' }
    },
    'link-mailto': {
        result: 'href',
        type: {
            name: 'fieldgroup',
            effect: 'mailto',
            fields: [
                {   type: { name: 'text' },
                    result: 'to',
                    label: 'Email address(s) to send to' },
                {   type: { name: 'text' },
                    result: 'subject',
                    label: 'Subject line' },
                {   type: { name: 'textarea' },
                    result: 'body',
                    label: 'Email body text' }
            ]
        }
    },
    'link-url': {
        label: 'Link URL',
        result: 'href',
        type: { name: 'text' }
    },
    'link-tel': {
        result: 'href',
        type: {
            name: 'fieldgroup',
            effect: 'telLink',
            fields: [
                {   type: { name: 'text' },
                    result: 'number',
                    label: 'Enter telephone number'
                }
            ]
        }
    },
    'link-choice': {
        label: 'Select a link type',
        fieldchoice: true,
        result: 'href',
        type: {
            name: 'dropdown',
            menu: 'link-types',
            selected: 'None'
        }
    }

}