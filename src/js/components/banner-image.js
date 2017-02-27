Cmint.createComponent({
    template: '\
        <a v-if="config._fields.output.link"\
            :href="config._fields.output.link"\
            target="_blank">\
            <img :src="config._fields.output.source" :style="config._css" \
                 :data-src="config._fields.output.source2" data-hook="vertical-space" /></a>\
        <img v-else :src="config._fields.output.source" :style="config._css" \
                 :data-src="config._fields.output.source2" data-hook="vertical-space" />',
    config: {
        _name: 'banner-image',
        _display: 'Banner Image',
        _category: 'Images',
        _css: {
            'width':'100%',
            'display': 'block',
            'margin':'0 auto'
        },
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
                {   name: 'link-choice',
                    result: 'link'      },
                {   name: 'image-choice',
                    result: 'source'    }
            ]
        }
    }
})