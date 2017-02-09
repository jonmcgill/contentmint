//
//  src/js/component-heading.js
//
Vue.component('heading', {
    props: ['config'],
    template: '<div data-editor="basic" data-prop="content" v-html="config.content"></div>'
})