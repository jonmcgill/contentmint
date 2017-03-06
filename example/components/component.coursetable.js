Cmint.createComponent({
    template: '\
        <comp :config="config" cellspacing="5" cellpadding="5" align="center" width="100%">\
            <thead>\
                <tr>\
                    <th :style="config.css.header">Date</th>\
                    <th :style="config.css.header">Course Name</th>\
                    <th :style="config.css.header">Course ID</th>\
                    <th :style="config.css.header">Register</th>\
                </tr>\
            </thead>\
            <context\
                :contexts="config.contexts.rows"\
                :tag="config.tags.rows"\
                :insert="config.tags.insert"\
                data-context="rows"></context>\
        </comp>',
    config: {
        name: 'course-table',
        display: 'Course Table',
        tags: { 
            root: 'table',
            rows: 'tbody',
            insert: 'tr'
        },
        category: 'Content',
        css: {
            header: { 
                background: 'black', 
                color: 'white',
                'font-family': 'Arial',
                'text-align': 'center'
            }
        },
        contexts: {
            rows: [{
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
            }]
        }
    }
})