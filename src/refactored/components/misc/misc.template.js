Vue.component('content-template', {

    props: ['fieldsComponent', 'template', 'stage'],

    template: '',

    created: function() {
        var stage = '<context id="Stage" :contexts="stage" data-context="stage"></context>';
        var template = '<div id="Template">';
        template += this.template.replace(/\{\{\s*stage\s*\}\}/, stage);
        template += '</div>';
        this.$options.template = template;
    }

})