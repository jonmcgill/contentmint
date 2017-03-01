var Cmint = (function() {
    
    function createComponent(options) {
        if (!options.template) throw 'Your component is missing a template';
        if (!options.config) throw 'You component is missing its config';
        if (Components[options.config._name]) {
            throw 'That component already exists';
        } else {
            if (!options.config._index) {
                options.config._index = '';
            }
            Components[options.config._name] = options.config;
            Vue.component(options.config._name, {
                props: ['config'],
                template: options.template
            })
        }
    }

    function createField(options) {
        if (!options.name) throw 'You must give all created fields a name';
        if (!options.config.type) throw 'You must give all created fields a field type';
        if (!options.config.label) throw 'You must give all created fields a label';
        if (!options.config.input) throw 'You must associate all created fields with an input';
        
        if (Fields[options.name]) {
            throw 'Field already exists';
        } else {
            Fields[options.name] = options.config;
        } 
    }

    function createProcess(name, fn) {
        if (Process[name]) {
            throw 'Process name already exists';
        } else {
            Process[name] = fn;
        }
    }

    function createMenu(name, items) {
        if (Menus[name]) {
            throw 'Menu name already exists';
        } else {
            Menus[name] = items;
        }
    }

    function createTemplate(name, components) {
        if (Templates[name]) {
            throw 'Template name already exists';
        } else {
            Templates[name] = components
        }
    }

    function setAvailableComponents(components) {
        return components.map(function(comp) {
            return Util.copy(Components[comp]);
        })
    }

    function tokenize(input, component) {
        var output = input;
        if (!component._tokens) return output;
        component._tokens.forEach(function(pair) {
            var token = Object.keys(pair)[0];
            var exp = new RegExp('\\{\\{\\s*'+token+'\\s*\\}\\}', 'g');
            var value, matches;
            // searches _content first for token
            if (component._content) {
                if (component._content[pair[token]]) {
                    value = component._content[pair[token]];
                    // get rid of html tags if present
                    value = value.replace(/<.+?>/g,'');
                }
            }
            // then search output for the token value
            else if (component._fields.output[pair[token]]) {
                value = component._fields.output[pair[token]];
            // then searches in the inputs
            } else {
                component._fields.list.forEach(function(field) {
                    if (field.inputs[pair[token]]) {
                        value = field.inputs[pair[token]];
                    }
                })
            }
            value = value || '';
            matches = output.match(exp);
            if (matches) {
                output = output.replace(exp, value);
                Util.debug('tokenizing: {{ ' + token + ' }} --> ' + value);
            }
        })
        return output;
    }

    return {
        createComponent: createComponent,
        createField: createField,
        createProcess: createProcess,
        createMenu: createMenu,
        createTemplate: createTemplate,
        setAvailableComponents: setAvailableComponents,
        tokenize: tokenize
    }

})()