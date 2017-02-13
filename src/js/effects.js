//
//  src/js/effects.js
//
var effects = {

    mailto: function(component, result, json) {

        var config = json ? getComponentJSON(component.$el) : component.config;
        var settings = config.settings;
        var output = 'mailto:';

        settings.to = settings.to || '';
        settings.subject = settings.subject || '';
        settings.body = settings.body || '';

        output += settings.to + '?';
        output += 'Subject=' + encodeURIComponent(effects.tokenize(component, settings.subject, json)) + '&';
        output += 'Body=' + encodeURIComponent(effects.tokenize(component, settings.body, json));
        output = effects.tokenize(component, output, json);

        settings[result] = output;

        return output;

    },

    telLink: function(component, result, json) {

        var config = json ? getComponentJSON(component.$el) : component.config;
        var settings = config.settings;
        var output;

        settings.number = settings.number || '';

        if (settings.number) {
            output = 'tel:' + effects.tokenize(component, settings.number, json);
        }

        settings[result] = output;

        return output;

    },

    tokenize: function(component, value, json) {

        if (component.config.tokens) {
            component.config.tokens.forEach(function(token) {
                var config = json ? getComponentJSON(component.$el) : component.config;
                var data = config[token[1]] || config.settings[token[1]];
                var clean = data.replace(/<.+?>/g, '');
                var exp = new RegExp('\\{\\{\\s*'+token[0]+'\\s*\\}\\}', 'g');
                value = value.replace(exp, clean);
            })
        }
        return value;
    }

}