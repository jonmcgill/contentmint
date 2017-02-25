Cmint.createComponent({
    template: '\
        <a v-if="config._fields.output.link" :href="config._fields.output.link">\
            <img :src="config._fields.output.source" width="100%" \
                 :data-src="config._fields.output.source2" /></a>\
        <img v-else :src="config._fields.output.source" width="100%" \
                    :data-src="config._fields.output.source2" />',
    config: {
        _name: 'banner-image',
        _display: 'Banner Image',
        _category: 'Images',
        _tokens: [
            { 'url': 'link' },
            { 'source': 'source' }
        ],
        _fields: {
            output: {
                source: 'http://placehold.it/800x300',
                link: ''
            },
            list: [
                {   name: 'image-choice',
                    result: 'source'    }
            ]
        }
    }
})