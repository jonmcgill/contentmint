var Components = Components || {},
    Fields = Fields || {},
    Process = Process || {},
    Menus = Menus || {},
    Templates = Templates || {}
    Data = Data || {};

var Bus = Bus || new Vue();

Object.defineProperties(Vue.prototype, {
    $bus: {
        get: function() {
            return Bus;
        }
    }
})