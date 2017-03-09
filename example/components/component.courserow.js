Cmint.createComponent({
    template: '\
        <comp :config="config">\
            <td :style="config.css.row" :bgcolor="config.fields.output.bgcolor" data-edit="platform"></td>\
            <td :style="config.css.row" :bgcolor="config.fields.output.bgcolor" data-edit="date"></td>\
            <td :style="config.css.row" :bgcolor="config.fields.output.bgcolor" data-edit="time"></td>\
            <td :style="config.css.row" :bgcolor="config.fields.output.bgcolor" data-edit="code"></td>\
            <td :style="config.css.row" :bgcolor="config.fields.output.bgcolor" data-edit="name"></td>\
            <td :style="config.css.row" :bgcolor="config.fields.output.bgcolor">\
                <a :href="config.fields.output.register" style="color: rgb(11, 75, 135);">Click Here</a>\
            </td>\
        </comp>',
    config: {
        name: 'course-row',
        display: 'Course Row',
        tags: { root: 'tr' },
        tokens: [
            { 'platform': 'platform' },
            { 'date': 'date' }, 
            { 'time': 'time' },
            { 'code': 'code' },
            { 'name': 'name' },
        ],
        content: {
            platform: 'Contact Management',
            date: '3/6/2017',
            time: '11:00 am',
            name: 'Introduction to Contact Management',
            code: 'CM101'
        },
        css: {
            row: { 
                'text-align': 'center',
                'border': '1px solid #1e201f',
                'font-family': 'sans-serif',
                'font-size': '12px'
            }
        },
        fields: {
            output: { register: '#', bgcolor: '' },
            list: [
                {name: 'link-mailto', result: 'register' },
                {name: 'bgcolor', result: 'bgcolor' }
            ]
        }
    }
})