//
//  src/js/componentDefaults.js
//
var componentDefaults = {
    'two-column': {
        name: 'two-column',
        display: 'Two Columns',
        left: [
            {
                name: 'body-copy',
                display: 'Body Copy',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis feugiat aliquet tristique.'
            }
        ],
        right: [
            {
                name: 'body-copy',
                display: 'Body Copy',
                content: 'Fusce vitae eros metus. In mollis scelerisque lorem, at placerat sem porttitor a.'
            }
        ]
    },
    'body-copy': {
        name: 'body-copy',
        display: 'Body Copy',
        content: 'Change this content. You can add lists, links, and special characters. You can make text bold, italic, or even center aligned.'
    },
    'heading': {
        name: 'heading',
        display: 'Title',
        content: '<div style="font-family:Arial,sans-serif;font-size:2.4em;">Lorem Ipsum Titlum</div>'
    },
    'banner': {
        name: 'banner',
        display: 'Banner Image',
        settings: {
            active: false,
            src: 'http://scoopit.co.nz/static/images/default/placeholder.gif',
            alt: 'Default alt text',
            href: '',
            to: 'jon_mcgill@reyrey.com',
            subject: 'Subject lines are the gateway to your heart',
            body: 'This body copy is default and could be better but I don\'t really care at the moment.'
        },
        tokens: ['alt', 'src'],
        fields: [
            {   
                label: 'Select an image',
                type: { 
                    name: 'dropdown', 
                    menu: 'images',
                    selected: 'Default'
                },
                result: 'src',
            },
            {
                label: 'Write in an image URL',
                result: 'src',
                type: { name: 'text' }
            },
            {
                label: 'Image alt text',
                type: { name: 'text' },
                result: 'alt',
            },
            {
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
            }
        ]
    }
}