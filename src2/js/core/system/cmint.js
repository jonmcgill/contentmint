var Cmint = (function() {
    
    function createComponent(options) {
        if (!options.template) throw 'Your component is missing a template';
        if (!options.config) throw 'You component is missing its config';
        if (Components[options.config._name]) {
            throw 'That component already exists';
        } else {
            Components[options.config._name] = options.config;
            Vue.component(options.config._name, {
                props: ['config'],
                template: options.template
            })
        }
    }

    function createField(options) {
        if (Fields[options.name]) {
            throw 'Field already exists';
        } else {
            Fields[options.name] = options.config;
        } 
    }

    function displayOnLoad() {
        return Util.jprs($('#SavedContent').text());
    }

    return {
        createComponent: createComponent,
        createField: createField,
        displayOnLoad: displayOnLoad
    }

})()