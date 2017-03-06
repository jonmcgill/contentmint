// Creates a component hook function
// Component hooks fire when a component is mounted or updated by Vue.
// Hook types can be 'Local' or 'Global'. Local hooks need to be referenced
// in the component config and will onyl run on that component. Global
// hooks will run on every single component.
// Component hooks take the components root element.
Cmint.createComponentHook = function(name, type, fn) {
    if (Cmint.Instance.Hooks[type][name]) {
        console.error(type + ' component hook "'+name+'" already exists');
    } else {
        Cmint.Instance.Hooks[type][name] = fn;
    }
}