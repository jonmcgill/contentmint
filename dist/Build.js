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
        editorToolbar: '#EditorToolbar',
        loading: '#Loading',
        stage: '#Stage',
        thumbnails: '#Thumbnails',
        trash: '#Trash'
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
        hoverIndication(this.$el);
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
        hoverIndication(this.$el);
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
        contentName: 'Content Name Goes Here',
        stage: [],
        store: '',
        saved: '',
        thumbnails: [
            componentDefaults['body-copy'],
            componentDefaults['two-column']
        ],
        trash: [],
        username: 'User Name'
    },
    methods: {
        save: function() {
            this.saved = JSON.stringify(collectData());
        },
        collect: function() {
            this.store = JSON.stringify(collectData());
        },
        refresh: function() {
            var _this = this;
            _this.empty();
            Vue.nextTick(function() {
                _this.stage = JSON.parse(_this.store);
            })
        },
        empty: function() {
            this.stage = [];
            $(g.id.stage).empty();
        },
        load: function() {
            var _this = this;
            _this.empty();
            Vue.nextTick(function() {
                _this.stage = JSON.parse(_this.saved);
            })
        }
    },
    mounted: function() {
        $(g.id.loading).remove();
        $('.thumbnail').on('mouseenter mouseleave', function() {
            $(this).toggleClass('hovered');
        })
    }
})
//
//  src/js/nodes.js
//
g['$'] = {
    app: $(g.id.app),
    stage: $(g.id.stage),
    thumbnails: $(g.id.thumbnails),
    trash: $(g.id.trash)
}

g.node = {
    app: g.$.app[0],
    stage: g.$.stage[0],
    thumbnails: g.$.thumbnails[0],
    trash: g.$.trash[0]
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


function debug(output) {
    if (g.debug) {
        if (typeof(output) === 'string') {
            console.log('DEBUG: ' + output);
        } else if (typeof(output) === 'object') {
            console.log(output);
        } else if (typeof(output) === 'function') {
            output();
        }
    }
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


function hoverIndication(elem) {
    $(elem).on('mouseenter', function(e) {
        var t = $(e.target);
        if (t.hasClass('Component') || t.hasClass('Context')) {
            t.addClass(g.name.hovered);
            var parent = t.parents('.hovered');
            if (parent[0] && parent[0] !== e.target) {
                parent.addClass('hovered-nested');
            }
        }
    }).on('mouseleave', function(e) {
        var t = $(e.target);
        if (t.hasClass('hovered-nested')) {
            if (t.parents('.hovered').length === 0) {
                t.removeClass('hovered hovered-nested')
            }
        } else if (t.hasClass('hovered')) {
            if (t.parents('.hovered').length > 0) {
                t.parents('.hovered').first().removeClass('hovered-nested');
            }
            t.removeClass('hovered');
        }
    })
}
//
//  src/js/collectData.js
//
//  Walks the stage DOM elements and assembles json
//  from the data-config elements and their children.
function collectData(elem, data) {
    var data = data || [];
    var elem = elem || g.node.stage;
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
    return data;
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
    app.collect();
    Vue.nextTick(function() {
        app.refresh();
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
                    $component.attr(g.name.config, JSON.stringify(componentData));
                })
            }

            var editorID = genID(10);
            $editorElement.attr(g.name.editorID, editorID)
            editorConfig.selector = '['+g.name.editorID+'="'+editorID+'"]';
            $editorElement.on('mouseover', function() {
                if (!$editorElement.hasClass('mce-content-body')) {
                    tinymce.init(editorConfig);
                    debug('editor initiated - ' + editorID);
                }
            })

        }

    })

}
//
//  src/js/initDragula.js
//
var drake = dragula([g.node.thumbnails, g.node.stage, g.node.trash], {

    copy: function(el, source) {
        return source === g.node.thumbnails;
    },

    // http://jsfiddle.net/cfenzo/7chaomnz/ (for the contains bit)
    // Was getting child node error from dragula when moving nested containers
    accepts: function(el, target) {
        return target !== g.node.thumbnails && !contains(el, target);
    },

}).on('drop', function(el, target, source, sibling) {

    if (target === g.node.trash) {
        
        syncStageAndStore();
        debug('Component trashed');
        debug(checkSync);
        g.$.trash.empty();

    } else if (source === g.node.thumbnails && $(target).hasClass(g.name.context)) {

        var compData = JSON.parse($(el).find(g.class.component).attr(g.name.config));
        var index = getIndex($(el).parent(), el);
        var dataPath = walk.up(el);

        $(el).remove();
        walk.down(dataPath.reverse(), compData);

        Vue.nextTick(function() {
            app.collect();
            debug(checkSync);
        })
    }
    if ((source === g.node.Stage || $(source).hasClass(g.name.context)) &&
        (target === g.node.Stage || $(target).hasClass(g.name.context))) {
        syncStageAndStore();
        debug(checkSync);
    }
}).on('over', function(el, container, source) {

    if (container === g.node.trash) {
        g.$.trash.addClass('trashing');
    } else {
        g.$.trash.removeClass('trashing');
    }

}).on('dragend', function(el, container, source) {

    g.$.trash.removeClass('trashing');

})

function addContainer(el) {
    if (!$(el).closest('.thumbnail').length && drake) {
        drake.containers.push(el);
    }
}