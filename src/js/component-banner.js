//
//  src/js/component-banner.js
//
Vue.component('banner', {
    props: ['config'],
    template: '\
    <div>\
        <a v-if="config.settings.href" :href="config.settings.href">\
            <img :src="config.settings.src" :alt="config.settings.alt" :style="css" />\
        </a>\
        <img v-else :src="config.settings.src" :alt="config.settings.alt" :style="css" />\
        <field-widget :config="config"></field-widget>\
    </div>\
    ',
    data: function() {
        return {
            css: {
                'width': '100%'
            }
        }
    }
})