//
//  src/js/global.js
//
var g = {
    attr: {
        contextName: '[data-context-name]',
        editor: '[data-editor]'
    },
    class: {
        component: '.Component'
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
        contextName: 'data-context-name',
        editor: 'data-editor',
        editorID: 'data-editor-id',
        editorPlain: 'plain',
        editorBasic: 'basic',
        editorRobust: 'robust',
        prop: 'data-prop',
        thumbnail: 'thumbnail'
    }
}
//
//  src/js/component-wrapper.js
//
//  wrappers contain any given component. They handle the logic of the components.
//  wrappers take raw component data, call the component with the name and then
//  pass that data right on along to the generated component
Vue.component('wrapper', {
    props: ['config'],
    template: '\
        <div class="Component">\
            <component :is="config.name" :config="config"></component>\
        </div>',
    mounted: function() {
        initStageComponent(this);
        initEditor(this.$el);
    },
    updated: function() {
        initStageComponent(this);
    }
})
//
//  src/js/component-context.js
//
//  context components do not have editable content. Rather, they
//  are additional wrappers around components that offer different
//  layout possibilities. Each context instance dynamically generates
//  wrapped components given the set of component data given
//  
//  Additionally, when mounted, the context component is added to the
//  dragula instance so it can receive other components
Vue.component('context', {
    props: ['components'],
    template: '\
        <div class="Context">\
            <wrapper v-for="config in components" :config="config"></wrapper>\
        </div>',
    mounted: function() {
        addContainer(this.$el);
    }
})
//
//  src/js/component-body-copy.js
//
//  Remember, all components are wrapped by the wrapper component. They must take a 'config'
//  prop passed from the wrapper.
Vue.component('body-copy', {
    props: ['config'],
    template: '<div data-editor="basic" data-prop="content" v-html="config.content"></div>'
})
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
            <context :components="config.left" data-context-name="left"></context>\
            <context :components="config.right" data-context-name="right"></content>\
        </div>'
});
//
//  src/js/componentDefaults.js
//
var componentDefaults = {
    'two-column': {
        name: 'two-column',
        display: 'Two Columns',
        left: [],
        right: []
    },
    'body-copy': {
        name: 'body-copy',
        display: 'Body Copy',
        content: '<p>Change this content. You can add lists, links, and special characters. You can make text bold, italic, or even center aligned.</p>'
    }
}
//
//  src/js/main.js
//
var app = new Vue({
    el: '#App',
    data: {
        thumbnails: [
            componentDefaults['body-copy'],
            componentDefaults['two-column']
        ],
        stage: [],
        store: '',
        saved: ''
    },
    methods: {
        save: function() {
            this.saved = JSON.stringify(collectData());
        },
        empty: function() {
            this.stage = [];
            $(g.id.stage).empty();
        },
        load: function() {
            var _this = this;
            _this.empty();
            Vue.nextTick(function() {
                _this.stage = JSON.parse(_this.store);
            })
        }
    },
    mounted: function() {
        $(g.id.loading).remove();
    }
})
//
//  src/js/nodes.js
//
g['$'] = {
    app: $(g.id.app),
    thumbnails: $(g.id.thumbnails),
    stage: $(g.id.stage)
}

g.node = {
    app: g.$.app[0],
    thumbnails: g.$.thumbnails[0],
    stage: g.$.stage[0]
}
//
//  src/js/util.js
//
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


function genID(num) {
    var id = 'ID-', i = 1;
    while (i <= num) {
        if (i % 2 === 0) {
            id += String.fromCharCode(random(65, 90));
        } else {
            id += String.fromCharCode(random(48, 57));
        }
        i++;
    }
    return id;
}


function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}


function getIndex(area, item) {
    var index;
    $(area).children().each(function(i) {
        if (this === item) {
            index = i;
            return false;
        }
    })
    return index;
}


function contains(a, b){
  return a.contains ?
    a != b && a.contains(b) :
    !!(a.compareDocumentPosition(b) & 16);
}


function log(thing) {
    console.log(thing);
}
//
//  src/js/collectData.js
//
//  Walks the stage DOM elements and assembles json
//  from the data-config elements and their children.
function collectData(elem, data) {
    var data = data || [];
    var elem = elem || g.node.Stage;
    var children = $(elem).children();
    if (children.length) {
        children.each(function() {
            var child = this;
            var comp = JSON.parse($(child).attr(g.name.config));
            var contexts = $(child)
                .find(g.attr.contextName)
                .toArray()
                .filter(function(l) {
                    return $(l).closest(g.class.component)[0] === child;
                })
            if (contexts.length) {
                contexts.forEach(function(context) {
                    comp[$(context).attr(g.name.contextName)] = collectData(context);
                })
            }
            data.push(comp);
        })
    }
}
//
//  src/js/walk.js
//
var walk = {
    up: function(el, selector) {
        var path = [];
        function travel(elem) {
            var nextContext = $(elem).closest('.Context')[0];
            var index = getIndex(nextContext, elem);
            var name = $(nextContext).attr('data-context-name');
            path.push({index: index, name: name});
            if ($(nextContext).attr('id') !== 'Stage') {
                travel($(nextContext).closest('.Component')[0])
            }
        }
        travel(el);
        return path;
    },

    down: function(path, obj) {
        var item = app;
        path.forEach(function(data, i) {
            if (i === path.length - 1) {
                item[data.name].splice(data.index, 0, obj);
            } else {
                item = item[data.name][data.index];
            }
        })
        return;
    }
}
//
//  src/js/dom-data-sync.js
//
function checkSync() {
    setTimeout(function() {
        console.log('Synced: ' + (JSON.stringify(collectData()) === JSON.stringify(app.stage)));
    }, 500);
    
}
function syncStageAndStore() {
    app.save();
    Vue.nextTick(function() {
        app.load();
    })
}
//
//  src/js/initStageComponent.js
//
function initStageComponent(instance) {
    
    var element = instance.$el,
        componentData = copy(instance.config);

    var contextNames = $(element)
        .find(g.attr.contextName)
        .toArray()
        .filter(function(elem) {
            return $(elem).closest(g.class.component)[0] === element;
        })
        .map(function(elem) {
            return $(elem).attr(g.name.contextName);
        })

    contextNames.forEach(function(name) {
        componentData[name] = [];
    })

    $(element).attr(g.name.config, JSON.stringify(componentData));

}
//
//  src/js/initEditor.js
//
function globalEditorConfig() {
    return {
        inline: true,
        menubar: false,
        insert_toolbar: false,
        fixed_toolbar_container: g.id.editorToolbar,
        plugins: 'link lists paste textpattern autolink',
    }
}


function initEditor(component) {

    var editorConfig = globalEditorConfig(),
        $component = $(component);

    $component.find(g.attr.editor).each(function() {

        var editorElement = this,
            $editorElement = $(this),
            editorType = $editorElement.attr(g.name.editor),
            editorInitiated = $editorElement.attr(g.name.editorID),
            isThumbnail = $component.parent().hasClass(g.name.thumbnail);
            console.log(!editorInitiated)
            console.log(isThumbnail)
        if (!editorInitiated && !isThumbnail) {
            switch(editorType) {
                case g.name.editorPlain:
                    editorConfig.toolbar = g.editors.plain;
                    break;
                 case g.name.editorBasic:
                    editorConfig.toolbar = g.editors.basic;
                    break;
                 case g.name.editorRobust:
                    editorConfig.toolbar = g.editors.robust;
                    break;
                default:
                    editorConfig.toolbar = g.editors.basic;
                    break; 
            }

            editorConfig.setup = function(editor) {
                editor.on('Change keyup', function() {
                    var componentData = JSON.parse($component.attr(g.name.config)),
                        componentProp = $editorElement.attr(g.name.prop);
                    componentData[componentProp] = editor.getContent();
                    $component.attr(g.name.config, JSON.parse(componentData));
                })
            }

            var editorID = genID(10);
            $editorElement.attr(g.name.editorID, editorID)
            editorConfig.selector = '['+g.name.editorID+'="'+editorID+'"]';
            $editorElement.on('mouseover', function() {
                tinymce.init(editorConfig);
                console.log('init editing');
            })

        }

    })

}
//
//  src/js/initDragula.js
//


var drake = dragula([g.node.thumbnails, g.node.stage], {

    copy: function(el, source) {
        return source === g.node.thumbnails;
    },

    // http://jsfiddle.net/cfenzo/7chaomnz/ (for the contains bit)
    // Was getting child node error from dragula when moving nested containers
    accepts: function(el, target) {
        return target !== g.node.thumbnails && !contains(el, target);
    },

    removeOnSpill: function(el, source) {
        return source === g.node.Stage;
    }


}).on('drop', function(el, target, source, sibling) {
    /*
        So, when a new component is created in the staging area, it starts
        as a direct copy of the thumbnail. Previously we just removed that element,
        inserted its data into the Vue instance, and let Vue handle rendering. However,
        since rearranging components in stage cannot interact with data, neither can
        adding components, otherwise lots of confusion.
    */
    if (source === g.node.thumbnails && $(target).hasClass(g.name.context)) {

        var compData = JSON.parse($(el).find(g.class.component).attr(g.name.config));
        var index = getIndex($(el).parent(), el);
        var dataPath = walk.up(el);

        $(el).remove();
        walk.down(dataPath.reverse(), compData);

        Vue.nextTick(function() {
            app.save();
            checkSync();
        })
    }
    if ((source === g.node.Stage || $(source).hasClass(g.name.context)) &&
        (target === g.node.Stage || $(target).hasClass(g.name.context))) {
        syncStageAndStore();
        checkSync();
    }
})

function addContainer(el) {
    if (!$(el).closest('.thumbnail').length && drake) {
        drake.containers.push(el);
    }
}