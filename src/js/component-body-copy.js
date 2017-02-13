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
        <table border="1" cellpadding="5" width="100%">\
            <tr>\
                <td width="33%" style="text-align:center;">Course Name</td>\
                <td width="33%" style="text-align:center;">Date</td>\
                <td width="33%" style="text-align:center;">Register</td>\
            </tr>\
            <tr>\
                <td style="text-align:center;" data-editor="basic" data-prop="course" v-html="config.course"></td>\
                <td style="text-align:center;" data-editor="basic" data-prop="date" v-html="config.date"></td>\
                <td style="text-align:center;"><a data-mailto :href="config.settings.href">Register!</a></td>\
            </tr>\
        </table>\
        <field-widget :config="config"></field-widget>\
    </div>\
    '
})