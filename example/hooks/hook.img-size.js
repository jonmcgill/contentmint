Cmint.createComponentHook('img-size', 'Local', {
    
    editing: function(element, config) {

        setTimeout(function() {
            $(element).find('img').each(function() {
                var $this = $(this);
                var w = this.naturalWidth;
                var h = this.naturalHeight;
                var ratio;

                if (w > 550) {
                    ratio = (w - 550) / w;
                    h = Math.round(h - (h * ratio));
                    w = 550;
                } else {
                    $this.attr('align', 'center');
                }

                $this.attr('width', w);
                $this.attr('height', h);
            })
        }, 800)
        
    }

})