Vue.component('toolbar', {
    props: ['changes'],
    template: '\
        <div id="Toolbar">\
            <button class="toolbar-undo" @click="undoClick" v-if="changes">\
                <i class="fa fa-undo"></i></button>\
            <button class="toolbar-undo" @click="undoClick" v-else disabled>\
                <i class="fa fa-undo"></i></button>\
            <button class="toolbar-save" @click="saveClick">\
                <i class="fa fa-save"></i></button>\
            <button class="toolbar-code">\
                <i class="fa fa-code"></i></button>\
        </div>',
    methods: {
        undoClick: function() {
            Cmint.app.undo();
        },
        saveClick: function() {
            Cmint.app.save();
        }
    }
})