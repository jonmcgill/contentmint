Cmint.createComponent({
    template: '\
        <comp :config="config" style="text-align:center;">\
            <a v-if="config.fields.output.link"\
               :href="config.fields.output.link"\
               target="_blank"\
               style="display:block">\
                <img :src="config.fields.output.source"\
                     :style="config.css"\
                     :width="config.fields.output.width"\
                     :height="config.fields.output.height" />\
            </a>\
            <img v-else\
                 :src="config.fields.output.source"\
                 :style="config.css"\
                 :width="config.fields.output.width"\
                 :height="config.fields.output.height" />\
            <br><br>\
        </comp>',
    config: {
        name: 'banner-image',
        display: 'Banner Image',
        category: 'Images',
        css: {
            'display': 'inline-block'
        },
        fields: {
            output: {
                source: 'http://placehold.it/550x200',
                link: '',
                dud: '100%',
                width: '100%',
                height: 'auto'
            },
            list: [
                {   name: 'link-choice',
                    result: 'link'      },
                {   name: 'image-presets',
                    result: 'source'    },
                {   name: 'img-proportions',
                    result: 'dud'     }
            ]
        }
    }
})