Cmint.actionBarHandler = function(component) {
    if (component.environment === 'components') return;
    var element = component.$el;
    var $el = $(element);
    $el.unbind();
    $el.click(function(e) {
        var nearestComponent = $(e.target).closest('.Component');
        if (nearestComponent[0] === element && !nearestComponent.hasClass('active')) {

            Cmint.app.focusedComponent = component;

            setTimeout(function() {
                var offset = $el.offset();
                var output = {};
                output.top = offset.top + 'px';
                output.left = offset.left + 'px';
                output.handle = offset.left + $el.width() + 'px';

                if($('#ActionBar.active').length) {
                    Bus.$emit('closeActionBar');
                    setTimeout(function() {
                        Bus.$emit('getComponentCoordinates', output, component);
                        setTimeout(function() {
                            Bus.$emit('openActionBar', component);
                        }, 100);                                        
                    },200)
                } else {
                    Bus.$emit('getComponentCoordinates', output, component);
                    setTimeout(function() {
                        Bus.$emit('openActionBar', component);
                    }, 100); 
                }
            }, 50);
        }
    })
}