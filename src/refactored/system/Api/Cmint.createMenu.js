// Defines a menu for dropdown fields.
// Each key is mapped to a value that will be inserted into a field input.
Cmint.createMenu = function(name, map) {
    
    if (Cmint.Instance.Menus[name]) {
        console.error('Menu "' + name + '" already exists');
    } else {
        Cmint.Instance.Menus[name] = map;
    }

}