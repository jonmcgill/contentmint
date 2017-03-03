// Creates a component and stores confit in Components
// Note: your template root element must always be <comp></comp>
// The <comp> component is the meta wrapper that handles all component logic.
// All component markup will be passed via slot.
//
/*  Available config options
    {
        name: 'machine-name', (required)
        display: 'Display Name', (required)
        category: 'Category Name', (required)
        tags: {
            root: 'h1' (overrides <comp> default div),
            other: 'main' (for context components in template)
        },
        contexts: {
            'left-column': [] (for nested components)
        },
        content: {
            'article': 'Lorem ipsum' (for data-edit that triggers tinymce)
        },
        hooks: ['name'], (runs on mount and receives component root element)
        tokens: [
            { 'token name': 'content or fields.output key name' }
        ],
        fields: {
            output: {
                'resultKey': 'value from post-processed field input'
            },
            list: [{ name: 'fieldname', result: 'output-key'}]
        }
    }
*/
Cmint.createComponent = function(options) {
    if (!options.template) console.error('All components need a template');
    if (!options.config) console.error('All components need config options');
    if (Cmint.Instance.Components[options.config.name]) {
        console.error('Component "'+options.config.name+'" already exists')
    } else {
        if (!options.config.index) options.config.index = [];
        Cmint.Instance.Components[name] = options.config;
        Vue.component(options.config.name, {
            props: ['config'],
            template: options.template
        })
    }
}