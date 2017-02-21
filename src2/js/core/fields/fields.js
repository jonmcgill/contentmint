Vue.component('fields', {
    props: ['component'],
    template: '\
        <div class="fields-container">\
            <field v-for="field in component._fields.list" :field="field" :component="component"></field>\
        </div>'
})