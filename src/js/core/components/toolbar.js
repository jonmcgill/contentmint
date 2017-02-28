Vue.component('toolbar', {
    props: ['changes', 'user', 'name'],
    template: '\
        <div id="Toolbar">\
            <button class="toolbar-code">\
                <i class="fa fa-code"></i>Get Code</button>\
            <button class="toolbar-save" @click="saveClick">\
                <i class="fa fa-save"></i>Save</button>\
            <button :class="{\'toolbar-context\': true, active: contextActive }"\
                @click="contextClick">\
                <i class="fa fa-object-ungroup"></i>Context</button>\
            <button class="toolbar-undo" @click="undoClick" v-if="changes">\
                <i class="fa fa-undo"></i>Undo</button>\
            <button class="toolbar-undo" @click="undoClick" v-else disabled>\
                <i class="fa fa-undo"></i>Undo</button>\
            <div id="EditorToolbar"></div>\
            <div class="right">\
                <span>{{ name }}</span><a :href="\'/\' + user">{{ user }}</a>\
            </div>\
        </div>',
    data: function(){return{
        contextActive: false
    }},
    methods: {
        undoClick: function() {
            Cmint.app.undo();
        },
        saveClick: function() {
            Cmint.app.save();
        },
        contextClick: function() {
            this.contextActive = !this.contextActive;
            Bus.$emit('contextualize');
            Util.debug('contextualized clicked');
        }
    }
})