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
                content: 'Left'
            }
        ],
        right: [
            {
                name: 'body-copy',
                display: 'Body Copy',
                content: 'Right'
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
            href: 'https://www.google.com'
        },
        fields: [
            {   
                label: 'Select an image',
                type: { 
                    name: 'dropdown', 
                    menu: 'images',
                    selected: '&nbsp;'
                },
                result: 'src',
            },
            {
                label: 'Image alt text',
                type: { name: 'text' },
                result: 'alt',
            },
            // {
            //     label: 'Select a link type',
            //     type: {
            //         name: 'dropdown',
            //         menu: 'link-types',
            //         selected: 'url'
            //     },
            //     result: 'href'
            // }
        ]
    }
}