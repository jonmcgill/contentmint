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

    function createProcess(name, fn) {
        if (Process[name]) {
            throw 'Process name already exists';
        } else {
            Process[name] = fn;
        }
    }

    function setAvailableComponents() {
        return Util.jprs($('#AvailableComponents').text());
    }

    function tokenize(input, component) {
        var output = input;
        component._tokens.forEach(function(pair) {
            var token = Object.keys(pair)[0];
            var exp = new RegExp('\\{\\{\\s*'+token+'\\s*\\}\\}', 'g');
            var value, matches;
            // searches output first for the token value
            if (component._fields.output[pair[token]]) {
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
        setAvailableComponents: setAvailableComponents,
        tokenize: tokenize
    }

})()