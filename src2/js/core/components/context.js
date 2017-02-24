Vue.component('context', {
    props: ['children'],
    template: '\
        <div class="Context">\
            <wrap v-for="child in children" :config="child" :key="child.id"></wrap>\
            <div class="context-insert" v-if="childNum">Drag components here</div>\
        </div>',
    computed: {
        childNum: function() {
            return this.children.length === 0;
        }
    }

})