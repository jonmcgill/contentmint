// Creates a new field instance
// Input = {
//     name: 'machine-name',
//     config: {
//          type: 'field-type', (required)
//          display: 'Appears in Dropdowns', (required)
//          label: 'Appears above field', (required)
//          help: 'Help text appears under the field',
//          check: /.*/g, used to check text fields
//          input: 'name of input key stored in component data', (required)
//              * field-text, field-choice, field-dropdown = String
//              * field-group = array [{name, label, type}]
//          choices: [{name, result}]
//              * field-choice - field definitions like in a component
//          hook: 'name' of field hook to run before sending to output,
//          menu: 'name' of a menu
//     }   
// }
Cmint.createField = function(options) {

    if (!options.name) console.error('You must give all created fields a name');
    if (!options.config.type) console.error('You must give all created fields a field type');
    if (!options.config.label) console.error('You must give all created fields a label');
    if (!options.config.input) console.error('You must associate all created fields with an input');
    
    if (Cmint.Instance.Fields.List[options.name]) {
        console.error('Field "'+options.name+'" already exists');
    } else {
        Cmint.Instance.Fields.List[options.name] = options.config;
    } 

}