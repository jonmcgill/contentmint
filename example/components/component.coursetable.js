Cmint.createComponent({
    template: '\
        <comp :config="config">\
            <table cellspacing="3" cellpadding="3" align="center" width="100%">\
                <tbody>\
                    <tr>\
                        <td width="90" :style="config.css.header">Platform</td>\
                        <td width="60" :style="config.css.header">Date</td>\
                        <td width="110" :style="config.css.header">Time (Eastern)</td>\
                        <td width="70" :style="config.css.header">Session Code</td>\
                        <td width="180" :style="config.css.header">Session Name</td>\
                        <td width="90" :style="config.css.header">Enroll Now</td>\
                    </tr>\
                </tbody>\
                <context\
                    :contexts="config.contexts.rows"\
                    :tag="config.tags.rows"\
                    :insert="config.tags.insert"\
                    data-context="rows">\
                </context>\
                <tbody>\
                    <tr>\
                        <td colspan="6" :style="config.css.header">Central Time &ndash; Subtract 1 hour; Mountain &ndash; Subtract 2 Hours; Pacific &ndash; Subtract 3 Hours</td>\
                    </tr>\
                </tbody>\
            </table>\
            <br>\
        </comp>',
    config: {
        name: 'course-table',
        display: 'Course Table',
        tags: {
            rows: 'tbody',
            insert: 'tr'
        },
        category: 'Content',
        css: {
            header: { 
                background: '#231f20', 
                color: 'white',
                'font-size': '12px',
                'font-family': 'Arial',
                'text-align': 'center'
            }
        },
        contexts: {
            rows: [{
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
            }]
        }
    }
})