//
//  src/js/global.js
//
var g = {
    debug: true,
    attr: {
        contextName: '[data-context-name]',
        editor: '[data-editor]'
    },
    class: {
        component: '.Component',
        context: '.Context',
        hovered: '.hovered'
    },
    editors: {
        plain: 'undo redo bold italic',
        basic: 'undo redo bold italic alignleft aligncenter link',
        robust: 'undo redo bold italic alignleft aligncenter link bullist numlist'
    },
    id: {
        app: '#App',
        loading: '#Loading',
        thumbnails: '#Thumbnails',
        editorToolbar: '#EditorToolbar',
        stage: '#Stage'
    },
    name: {
        config: 'data-config',
        context: 'Context',
        contextEmpty: 'Context-Empty',
        contextName: 'data-context-name',
        editor: 'data-editor',
        editorID: 'data-editor-id',
        editorPlain: 'plain',
        editorBasic: 'basic',
        editorRobust: 'robust',
        hovered: 'hovered',
        prop: 'data-prop',
        thumbnail: 'thumbnail'
    }
}