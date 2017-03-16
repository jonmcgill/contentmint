// field-group takes all inputs and the component instance
Cmint.createFieldProcess('img-proportions', function(input, component, field) {
    setTimeout(function() {
        $(component.$el).find('img').each(function() {
            var $this = $(this);
            var w = this.naturalWidth;
            var h = this.naturalHeight;
            var ratio;

            ratio = (w - input) / w;
            h = Math.round(h - (h * ratio));
            w = input;

            component.config.fields.output.width = w;
            component.config.fields.output.height = h;

        })
    }, 800)

    return input;
})