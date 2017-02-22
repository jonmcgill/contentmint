var Components = {},
    Fields = {},
    Process = {},
    Menus = {};

var Bus = new Vue();

Object.defineProperties(Vue.prototype, {
    $bus: {
        get: function() {
            return Bus;
        }
    }
})