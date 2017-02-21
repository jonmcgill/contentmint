Cmint.createComponent({
    template: '\
        <a v-if="config._fields.output.link" :href="config._fields.output.link">\
            <img :src="config._fields.output.source" width="100%" /></a>\
        <img v-else :src="config._fields.output.source" width="100%" />',
    config: {
        _name: 'banner-image',
        _display: 'Banner Image',
        _fields: {
            output: {
                source: 'http://scoopit.co.nz/static/images/default/placeholder.gif',
                link: ''
            },
            list: [
                {   name: 'image-source',
                    result: 'source'    },
            ]
        }
    }
})