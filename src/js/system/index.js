    
var Index = (function() {
    
    function getContainerIndex(child, parent) {
        var index = null;
        $(parent).children().each(function(i, l) {
            if (this === child) {
                index = i;
            }
        })
        return index;
    }

    function getDomIndex(elem, pathArray) {
        var name, index, path, context, parent;
        context = $(elem).closest('.Context');
        pathArray = pathArray || [];
        name = context.attr('data-context-name');
        index = getContainerIndex(elem, context);
        pathArray.unshift(index);
        pathArray.unshift(name);  
        parent = $(context).parent().closest('.Component');

        if (parent.length) {
            return pathArray = getDomIndex(parent[0], pathArray);
        } else {
            return pathArray;
        }
    }

    function getVueIndex(index, context, env) {
        var data;
        var env = env || Cmint.app;
        
        if (env === Cmint.componentList) {
            data = Util.copy(env);
            index.shift();
        } else {
            data = Util.copy(env[index.shift()]);
        }
        index.forEach(function(key, i) {
            if (context && (i === index.length - 1)) {
                data = {data: data, key: key};
            } else {
                data = data[key];
            }
        })
        Util.debug('got Vue index: ' + JSON.stringify(data));
        return data;
    }

    function retrieveVueContext(index, startContext) {
        var context = startContext,
            output;
        index.forEach(function(key, i) {
            if (i === index.length - 1) {
                output = { 
                    context: context, 
                    key: key
                };
            } else {
                context = context[key];
            }
        })
        return output;
    }

    function setVueIndex(index, data, newIndex) {
        var startContext, context, appContext, keyName, cut, newContext;
        startContext = Cmint.app[index[0]];
        context = Cmint.app[index.shift()];
        appContext = retrieveVueContext(index, context);
        if (!newIndex) {
            appContext.context.splice(appContext.key, 0, data);
        } else {
            newIndex.shift();
            newContext = retrieveVueContext(newIndex, startContext);
            var move = appContext.context.splice(appContext.key, 1)[0];
            newContext.context.splice(newContext.key, 0, move);
        }
    }

    return {
        getDomIndex: getDomIndex,
        getContainerIndex: getContainerIndex,
        getVueIndex: getVueIndex,
        retrieveVueContext: retrieveVueContext,
        setVueIndex: setVueIndex
    }

})()