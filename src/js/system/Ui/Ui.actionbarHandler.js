Cmint.Ui.actionbarHandler = function(component) {

    if (component.environment === 'components') return;

    var element = component.$el,
        $el = $(element);

    $el.unbind();

    $el.click(function(e) {

        var nearestComponent = $(e.target).closest(Cmint.Settings.class.component);

        if (nearestComponent[0] === element && !nearestComponent.hasClass('active')) {

            Cmint.App.activeComponent = component;

            setTimeout(function() {
                var offset = $el.offset();
                var output = {};
                output.top = offset.top + 'px';
                output.left = offset.left + 'px';
                output.handle = offset.left + $el.width() + 'px';

                if($('#ActionBar.active').length) {
                    Cmint.Bus.$emit('closeActionBar');
                    setTimeout(function() {
                        Cmint.Bus.$emit('getComponentCoordinates', output, component);
                        setTimeout(function() {
                            Cmint.Bus.$emit('openActionBar', component);
                        }, 100);                                        
                    },200)
                } else {
                    Cmint.Bus.$emit('getComponentCoordinates', output, component);
                    setTimeout(function() {
                        Cmint.Bus.$emit('openActionBar', component);
                    }, 100); 
                }
            }, 50);

        }

    })

}