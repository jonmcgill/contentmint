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