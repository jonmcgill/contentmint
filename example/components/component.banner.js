Cmint.createComponent({
    template: '\
        <comp :config="config">\
            <a v-if="config.fields.output.link" :href="config.fields.output.link" target="_blank" style="display:block">\
                <img :src="config.fields.output.source" :style="config.css" />\
            </a>\
            <img v-else :src="config.fields.output.source" :style="config.css" />\
            <br><br>\
        </comp>',
    config: {
        name: 'banner-image',
        display: 'Banner Image',
        category: 'Images',
        css: {
            'display': 'block'
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
                source: 'http://placehold.it/550x200',
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