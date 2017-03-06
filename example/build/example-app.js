// Default toolbar buttons are save, context, and undo. You'll most likely want to 
// write some kind of ajax request that does something with the data and/or markup
// from your created content. This is a way to add a toolbar button for that thing.
Cmint.createToolbarButton({
    text: 'Get Code',
    btnClasses: { 'toolbar-code':true, 'toolbar-btn-fancy': true },
    iconClasses: { 'fa': true, 'fa-code': true },
    callback: function() {
        Cmint.Util.debug('get content code');
    }
})
Cmint.createOnSaveHook(function(data) {
    Cmint.Util.debug('ran onSave hook: send data to back end script');
})
// Templates are just some html with a token that stands in place for the main staging
// area. In the place where you want to add components write in {{ stage }}. The path
// is used on page load to run an ajax request for the markup. The components array is
// just a list of components you'd like to make available for that template.
Cmint.createTemplate('email', {
    path: '/example/template-markup/email.html',
    components: ['heading', 'banner-image', 'body-copy', 'course-table', 'container']
})
Cmint.createMenu('align-block', {
    'Default': '',
    'Center': '0 auto'
})
Cmint.createMenu('image-list', {
    'Default': 'http://scoopit.co.nz/static/images/default/placeholder.gif',
    'Computer': 'http://www.imakenews.com/rbm/sed_computer.jpg',
    'Dayton Fountain': 'http://www.imakenews.com/rbm/sed_ru_fountain.jpg',
    'Instructor': 'http://www.imakenews.com/rbm/sed_instructor.jpg',
    'Keyboard': 'http://imakenews.com/rbm/sed_keyboard.jpg',
    'Students': 'http://www.imakenews.com/rbm/sed_students.jpg',
    'Mouse': 'http://www.imakenews.com/rbm/sed_mouse.jpg',
    'Cat': 'http://listhogs.com/wp-content/uploads/2016/06/10-14.jpg',
    'Norway': 'https://www.nordicvisitor.com/images/norway/sognefjord-norway.jpg',
    'The Grey': 'https://s-media-cache-ak0.pinimg.com/originals/b4/22/a1/b422a1816328a39b46e193c68df9e456.jpg',
    'YoYo': 'http://mediad.publicbroadcasting.net/p/michigan/files/styles/x_large/public/yoyo_ma_trumpie_12.jpg'
})
Cmint.createMenu('padding', {
    'Default': '',
    'A little': '1em',
    'A lot': '2.5em'
})
// type, display, label, choices[{name}]
Cmint.createField({
    name: 'link-choice',
    config: {
        type: 'field-choice',
        display: 'Link Type',
        label: 'Link Type',
        choices: [
            { name: 'link-url' },
            { name: 'link-mailto' }
        ]
    }
})
Cmint.createField({
    name: 'align-block',
    config: {
        type: 'field-dropdown',
        display: 'Alignment',
        label: 'Alignment',
        input: 'alignblock',
        menu: 'align-block'
    }
})
Cmint.createField({
    name: 'image-presets',
    config: {
        type: 'field-dropdown',
        display: 'Preset Images',
        label: 'Image List',
        input: 'selected-image',
        menu: 'image-list'
    }
})
// type, display, label, input, menu, help*, processes*
Cmint.createField({
    name: 'padding',
    config: {
        type: 'field-dropdown',
        display: 'Padding',
        label: 'Padding',
        input: 'padding',
        menu: 'padding'
    }
})
// type, display, label, input[{name, label, type}], processes[], help*
Cmint.createField({
    name: 'link-mailto',
    config: {
        type: 'field-group',
        display: 'Email Link',
        label: 'Email Link',
        processes: ['mailto'],
        input: [
            { name: 'to', 
              label: 'The email sendee', 
              type: 'input' },
            { name: 'subject', 
              label: 'The email subject line', 
              type: 'input' },
            { name: 'body', 
              label: 'The body of your email', 
              type: 'textarea' }
        ],
    }
})
Cmint.createField({
    name: 'bg-color',
    config: {
        type: 'field-text',
        display: 'Background Color',
        label: 'Background Color',
        input: 'bg',
        help: 'Any valid CSS color value'
    }
})
// type, display, label, input, help*, check*, processes*
Cmint.createField({
    name: 'color',
    config: {
        type: 'field-text',
        display: 'Color',
        label: 'Color',
        input: 'color',
        help: 'Any valid CSS color value'
    }
})
Cmint.createField({
    name: 'max-width',
    config: {
        type: 'field-text',
        display: 'Max Width',
        label: 'Max Width',
        input: 'maxwidth',
        help: 'add "px" to the end for pixels'
    }
})
Cmint.createField({
    name: 'link-url',
    config: {
        type: 'field-text',
        display: 'Link URL',
        label: 'Link URL',
        input: 'link',
        help: 'Absolute path including http(s)://',
        check: /^https*:\/\/.+/g,
    }
})
// Editor post processes are to the editor instance markup what component hooks are
// to components. Whenever a change occurs in a tinymce editing instance, a postprocess
// hook is run. Tinymce allows you to hook into that process and this is simply a
// wrapper around that feature injecting it into our tinymce implementation.
Cmint.createEditorPostProcess(function(e) {
    $(e.target.bodyElement).find('a').each(function() {
        var attrs = this.attributes;
        if (!attrs.style) {
            this.setAttribute('style', 'color:#0b4b87;');
        } else {
            this.attributes.style = this.attributes.style + 'color:#0b4b87';
        }
        this.setAttribute('target', '_blank');
    })
})
// field-group takes all inputs and the component instance
Cmint.createFieldProcess('mailto', function(inputs, component) {
    var output = 'mailto:';
    output += Cmint.Fields.tokenize(inputs.to.value, component) + '?';
    output += 'Subject=' + encode(Cmint.Fields.tokenize(inputs.subject.value, component)) + '&';
    output += 'Body=' + encode(Cmint.Fields.tokenize(inputs.body.value, component));
    function encode(val) { return encodeURIComponent(val); }
    return output;
})
// You may have situations where you'd like to manipulate a component after it has
// mounted or updated. You may also not want that thing to be the same in the editor
// versus the result. Additionally, you may want a thing to happen across the board for
// all components, or you may want to localize it to specific components when called.
// A component hook can therefore be global (runs on every component) or local (only
// runs if you define it in config). They can also be separate for the 'editing'
// experience and the 'cleanup' phase of the content.
Cmint.createComponentHook('vertical-space', 'Global', {
    editing: function(element) {
        $(element).css({
            'margin-bottom': '24px'
        });
    },
    cleanup: function(element) {
        $(element).css({'margin-bottom': null});
        $(element).insertAfter('<br><br>');
    }
})
Cmint.createComponent({
    template: '\
        <comp v-if="config.fields.output.link" :tag="config.tags.link" :config="config" :href="config.fields.output.link" target="_blank" style="display:block">\
            <img :src="config.fields.output.source" :style="config.css" />\
        </comp>\
        <comp v-else :tag="config.tags.image" :config="config" :src="config.fields.output.source" :style="config.css"></comp>',
    config: {
        name: 'banner-image',
        display: 'Banner Image',
        category: 'Images',
        css: {
            'width':'100%',
            'display': 'block',
            'margin':'0 auto'
        },
        tags: {
            image: 'img',
            link: 'a'
        },
        tokens: [
            { 'url': 'link' },
            { 'source': 'source' }
        ],
        fields: {
            output: {
                source: 'http://placehold.it/800x300',
                link: ''
            },
            list: [
                {   name: 'link-choice',
                    result: 'link'      },
                {   name: 'image-presets',
                    result: 'source'    }
            ]
        }
    }
})
Cmint.createComponent({
    template: '<comp :config="config" data-edit="copy" :style="config.css"></comp>',
    config: {
        name: 'body-copy',
        display: 'Body Copy',
        category: 'Content',
        css: {
            'line-height': '1.7',
            'font-family': 'sans-serif',
            'font-size': '1.05em'
        },
        content: {
            copy: '<div>This is some default text and I could have used Lorem, but I decided to use this instead. And what is this? It is a rambling, a muse, an attempt to fool you into thinking there is legitimate copy here when there actually isn\'t. And honestly, what is legitimate copy, anyways?</div>'
        }
    }
})
Cmint.createComponent({
    template: '\
        <comp :config="config" :style="{\
            padding:config.fields.output.padding,\
            \'max-width\': config.fields.output.maxwidth,\
            margin: config.fields.output.centerblock\
        }">\
            <context :contexts="config.contexts.container" data-context="container"></context>\
        </comp>',
    config: {
        name: 'container',
        display: 'Empty Container',
        category: 'Layout',
        contexts: {
            container: []
        },
        fields: {
            output: { padding: '', centerblock:'', maxwidth: '' },
            list: [
                {name: 'padding', result: 'padding'},
                {name: 'align-block', result: 'centerblock' },
                {name: 'max-width', result: 'maxwidth'}
            ]
        }
    }
})
Cmint.createComponent({
    template: '\
        <comp :config="config">\
            <td :style="config.css.row" data-edit="date"></td>\
            <td :style="config.css.row" data-edit="name"></td>\
            <td :style="config.css.row" data-edit="id"></td>\
            <td :style="config.css.row"><a :href="config.fields.output.register">Register</a></td>\
        </comp>',
    config: {
        name: 'course-row',
        display: 'Course Row',
        tags: { root: 'tr' },
        tokens: [{ date: 'date'}, {name: 'name'}, {id: 'id'}],
        content: {
            date: '3/6/2017',
            name: 'Contact Management Advanced',
            id: 'CM109'
        },
        css: {
            row: { 
                'text-align': 'center',
                'border': '1px solid black',
                'font-family': 'sans-serif'
            }
        },
        fields: {
            output: { register: '#' },
            list: [{name: 'link-mailto', result: 'register' }]
        }
    }
})
Cmint.createComponent({
    template: '\
        <comp :config="config" cellspacing="5" cellpadding="5" align="center" width="100%">\
            <thead>\
                <tr>\
                    <th :style="config.css.header">Date</th>\
                    <th :style="config.css.header">Course Name</th>\
                    <th :style="config.css.header">Course ID</th>\
                    <th :style="config.css.header">Register</th>\
                </tr>\
            </thead>\
            <context\
                :contexts="config.contexts.rows"\
                :tag="config.tags.rows"\
                :insert="config.tags.insert"\
                data-context="rows"></context>\
        </comp>',
    config: {
        name: 'course-table',
        display: 'Course Table',
        tags: { 
            root: 'table',
            rows: 'tbody',
            insert: 'tr'
        },
        category: 'Content',
        css: {
            header: { 
                background: 'black', 
                color: 'white',
                'font-family': 'Arial',
                'text-align': 'center'
            }
        },
        contexts: {
            rows: [{
                name: 'course-row',
                display: 'Course Row',
                tags: { root: 'tr' },
                tokens: [{ date: 'date'}, {name: 'name'}, {id: 'id'}],
                content: {
                    date: '3/6/2017',
                    name: 'Contact Management Advanced',
                    id: 'CM109'
                },
                css: {
                    row: { 
                        'text-align': 'center',
                        'border': '1px solid black',
                        'font-family': 'sans-serif'
                    }
                },
                fields: {
                    output: { register: '#' },
                    list: [{name: 'link-mailto', result: 'register' }]
                }
            }]
        }
    }
})
Cmint.createComponent({
    template: '\
        <comp :config="config" :style="{\
            background: config.fields.output.bg,\
            padding: config.fields.output.padding,\
            \'font-family\': config.css.fontFam,\
            color:config.fields.output.color}"\
            data-edit="text">\
        </comp>',
    config: {
        name: 'heading',
        display: 'Heading',
        category: 'Content',
        css: {
            fontfam: 'sans-serif'
        },
        tokens: [{'text': 'text'}, {'bg': 'bg'}],
        content: { text: '<h1 style="font-family:sans-serif;">Lorem Ipsum Headingum</h1>' },
        fields: {
            output: { color: '', bg: '', padding: '' },
            list: [
                { name: 'color', result: 'color' },
                { name: 'bg-color', result: 'bg' },
                { name: 'padding', result: 'padding' }
            ]
        }
    }
})