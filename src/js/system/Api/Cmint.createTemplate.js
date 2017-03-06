// Defines a template and assigns path and components
// options = {
//     path: '/path/to/template.html',
//     components: ['names', 'of', 'components']   
// }
Cmint.createTemplate = function(name, options) {

    if (Cmint.Instance.Templates[name]) {
        console.error('Template "' + name + '" already exists');
    } else {
        if (!options.path) {
            console.error('Need path for template "' + name + '"');
        }
        if (!options.components) {
            console.error('No components defined for template "' + name +'"');
        }
        Cmint.Instance.Templates[name] = options;
    }

}