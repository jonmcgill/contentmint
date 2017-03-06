// Meta component for contextual regions that nest <comp> instances
Vue.component('context', {

    props: ['tag', 'insert', 'contexts', 'thumbnails'],

    render: function(make) {

        var classes = {};
        var tag = this.tag || 'div';
        var insertTag = this.insert || 'div';
        var output;

        classes[Cmint.Settings.name.context] = true;

        if (this.thumbnails) {
            output = this.contexts.map(function(child) {
                return make('div', {'class': {'thumbnail': true}}, [
                    make('span', {'class': {'thumbnail-name': true}}, [child.display]),
                    make('div', {'class': {'thumbnail-component': true}}, [
                        make('div', {'class': {'thumbnail-scale-wrap': true}}, [
                            make(child.name, {props:{ 'config': child }})
                        ])
                    ])
                ])
            })
        } else {
            output = this.contexts.map(function(child) {
                return make(child.name, {
                    props: { 'config': child },
                    key: child.id
                })
            })
        }
        if (!this.contexts.length) {
            output = [make(insertTag, {'class':{'context-insert':true}},['Drag components here'])]
        }

        return make(
            tag, { 'class': classes },
            output
        )
    }

})