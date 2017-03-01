var Components = Components || {},
    Fields = Fields || {},
    Process = Process || {},
    Menus = Menus || {},
    Editor = Editor || {hooks:{}},
    Templates = Templates || {},
    Data = Data || {},
    Bus = Bus || new Vue();

Object.defineProperties(Vue.prototype, {
    $bus: {
        get: function() {
            return Bus;
        }
    }
})