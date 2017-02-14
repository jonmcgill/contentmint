//
//  src/js/componentDefaults.js
//
var componentDefaults = {
    'two-column': {
        name: 'two-column',
        display: 'Two Columns',
        contextTag: 'section',
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
    'table-data': {
        name: 'table-data',
        display: 'Course Table',
        componentTag: 'table',
        contextTag: 'tbody',
        rows: [{name: 'table-row',
        display: 'Course Row',
        course: 'Course name goes here',
        date: 'MM/DD/YYYY',
        componentTag: 'tr',
        settings: {
            active: false,
            href: ''
        },
        tokens: [['Course', 'course'], ['Date', 'date']],
        fields: ['link-mailto']}]
    },
    'table-row': {
        name: 'table-row',
        display: 'Course Row',
        course: 'Course name goes here',
        date: 'MM/DD/YYYY',
        componentTag: 'tr',
        settings: {
            active: false,
            href: ''
        },
        tokens: [['Course', 'course'], ['Date', 'date']],
        fields: ['link-mailto']
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
            href: ''
        },
        fields: ['image-dropdown', 'image-url', 'alt-text', 'link-choice']
    }
}