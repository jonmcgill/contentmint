//
//  src/js/component-two-column.js
//
//  This is an example of a context component. Every context component
//  needs to identify its context regions with data-context-name.
//  The associated default configuration must have those names as keys
//  with arrays as values.
Vue.component('two-column', {
    props: ['config'],
    template: '\
        <div class="ColumnWrap">\
            <context :components="config.left" data-context-name="left" :config="config"></context>\
            <context :components="config.right" data-context-name="right" :config="config"></content>\
        </div>'
});