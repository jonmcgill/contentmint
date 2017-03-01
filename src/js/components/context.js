Vue.component('context', {
    props: ['children', 'thumbnails', 'tag', 'insert'],
    render: function(make) {
        var tag = this.tag || 'div';
        var insertTag = this.insert || 'div';
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
                    props: { 'config': child },
                    key: child.id
                })
            })
        }
        if (!this.children.length) {
            output = [make(insertTag, {'class':{'context-insert':true}},['Drag components here'])]
        }
        return make(tag, {
            'class': {
                'Context': true
            }}, output)
    },
    computed: {
        childNum: function() {
            return this.children.length === 0;
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