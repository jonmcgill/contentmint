Vue.component('context', {
    props: ['children', 'thumbnails', 'tag'],
    render: function(make) {
        var tag = this.tag || 'div';
        var output;
        if (this.thumbnails) {
            output = this.children.map(function(child) {
                return make('div', {'class': {'thumbnail': true}}, [
                    make('span', {'class': {'thumbnail-name': true}}, [child._display]),
                    make('div', {'class': {'thumbnail-component': true}}, [
                        make('div', {'class': {'thumbnail-scale-wrap': true}}, [
                            make('wrap', {props:{ 'config': child }})
                        ])
                    ])
                ])
            })
        } else {
            output = this.children.map(function(child) {
                return make('wrap', {
                    class: { 'ShowLayout': this.showLayout },
                    props: { 'config': child },
                    key: child.id
                })
            })
        }
        if (!this.children.length) {
            output = [make('div', {'class':{'context-insert':true}},['Drag components here'])]
        }
        return make(tag, {'class': {'Context': true}}, output)
    },
    computed: {
        childNum: function() {
            return this.children.length === 0;
        },
        showLayout: function() {
            return Cmint.app ? Cmint.app.showLayout : false
        }
    },
    mounted: function() {
        var unwrap = $(this.$el).find('.unwrap');
        if (unwrap.children().length) {
            unwrap.children().unwrap();
        } else {
            // unwrap.remove();
        }
    }
})