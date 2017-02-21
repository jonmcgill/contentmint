Vue.component('context', {
    props: ['children'],
    template: '\
        <div class="Context">\
            <wrap v-for="child in children" :config="child"></wrap>\
        \</div>'
})