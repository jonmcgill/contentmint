Cmint.createComponent({
    template: '\
        <comp :config="config">\
            <td :style="config.css.row" data-edit="date"></td>\
            <td :style="config.css.row" data-edit="name"></td>\
            <td :style="config.css.row" data-edit="id"></td>\
            <td :style="config.css.row"><a :href="config.fields.output.register">Register</a></td>\
        </comp>',
    config: {
        name: 'course-row',
        display: 'Course Row',
        tags: { root: 'tr' },
        tokens: [{ date: 'date'}, {name: 'name'}, {id: 'id'}],
        content: {
            date: '3/6/2017',
            name: 'Contact Management Advanced',
            id: 'CM109'
        },
        css: {
            row: { 
                'text-align': 'center',
                'border': '1px solid black',
                'font-family': 'sans-serif'
            }
        },
        fields: {
            output: { register: '#' },
            list: [{name: 'link-mailto', result: 'register' }]
        }
    }
})