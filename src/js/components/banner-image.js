Cmint.createComponent({
    template: '\
        <div>\
            <a v-if="config._fields.output.link" :href="config._fields.output.link">\
                <img :src="config._fields.output.source" width="100%" \
                     :data-src="config._fields.output.source2" /></a>\
            <img v-else :src="config._fields.output.source" width="100%" \
                     :data-src="config._fields.output.source2" />\
            <div data-edit="caption"></div>\
        </div>',
    config: {
        _name: 'banner-image',
        _display: 'Banner Image',
        _category: 'Images',
        _content: {
            caption: '<p>Write your image caption here</p>'
        },
        _tokens: [
            { 'url': 'link' },
            { 'source': 'source' },
            { 'caption': 'caption' }
        ],
        _fields: {
            output: {
                source: 'http://placehold.it/800x300',
                link: ''
            },
            list: [
                {   name: 'link-mailto',
                    result: 'link'      },
                {   name: 'image-choice',
                    result: 'source'    }
            ]
        }
    }
})