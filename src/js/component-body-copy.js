//
//  src/js/component-body-copy.js
//
//  Remember, all components are wrapped by the wrapper component. They must take a 'config'
//  prop passed from the wrapper.
Vue.component('body-copy', {
    props: ['config'],
    template: '<div :style="css" data-editor="robust" data-prop="content" v-html="config.content"></div>',
    data: function() {
        return {
            css: {
                'font-size': '1.2em',
                'font-family': 'Arial, sans-serif',
                'line-height': '1.7',
                'color': 'rgba(0,0,0,0.78)'
            }
        }
    }
})

Vue.component('table-row', {
    props: ['config'],
    template: '\
    <div class="Component-Container">\
        <table>\
            <tr>\
                <td data-editor="basic" data-prop="col1" v-html="config.col1"></td>\
                <td data-editor="basic" data-prop="col2" v-html="config.col2"></td>\
                <td><a :href="config.settings.href">Register!</a></td>\
            </tr>\
        </table>\
        <field-widget :config="config"></field-widget>\
    </div>\
    '
})