Cmint.Fields.tokenize = function(input, component) {

    var output = input;

    if (!component.tokens || !output) return output;

    component.tokens.forEach(function(pair) {
        var token = Object.keys(pair)[0];
        var key = pair[token];
        var exp = new RegExp('\\{\\{\\s*'+token+'\\s*\\}\\}', 'g');
        var value, matches;

        // searches content keys first
        if (component.content && component.content[key]) {
            value = component.content[key].replace(/<.+?>/g,'');
        }

        // searches fields.output keys next
        else if (component.fields.output[key]) {
            value = component.fields.output[key]
        }

        // finally searches through input keys
        else {
            component.fields.list.forEach(function(field) {
                value = field.inputs[key] || value;
            })
        }

        value = value || '';
        matches = output.match(exp);
        if (matches) {
            output = output.replace(exp, value);
            Cmint.Util.debug('tokenized {{ '+token+' }} => ' + value);
        }

    })

    return output;
}