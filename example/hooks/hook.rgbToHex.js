
Cmint.createComponentHook('rgbtohex', 'Global', {

    markup: function(markup, config) {
        var rgbs = markup.match(/rgb\(\d+,\s*\d+,\s*\d+\)/g);
        if (rgbs) {
            rgbs.forEach(function(color) {
                var exp = new RegExp(color.replace(/\(/g,'\\(').replace(/\)/g, '\\)'), 'g');
                var hex = color.replace(/rgb\(/,'').replace(/\)/,'');
                hex = hex.split(', ');
                hex = hex.map(function(val) {
                    val = val * 1;
                    val = val.toString(16);
                    if (val.length === 1) val = '0' + val;
                    return val;
                }).join('');
                markup = markup.replace(exp, '#' + hex)
            })
        }
        config.markup = markup;
    }

})