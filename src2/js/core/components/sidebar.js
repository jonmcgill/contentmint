Vue.component('sidebar', {
    props: ['user', 'name', 'components', 'fieldComponent'],
    template: '\
        <aside id="Sidebar">\
            <div class="sidebar-top">\
                <input type="text" v-model="name" class="content-name" />\
                <span class="username">{{ user }}</span>\
            </div>\
            <div class="sidebar-sub">\
            \
            </div>\
            <div class="sidebar-main">\
                <context id="Components" data-context-name="components" :children="components"></context>\
            </div>\
        </aside>'
})