Cmint.createField({
    name: 'link-mailto',
    config: {
        type: 'field-group',
        display: 'Email Link',
        hook: 'mailto',
        label: 'Fill in the fields for your email link (field-group)',
        input: [
            { name: 'to', 
              label: 'The email sendee', 
              type: 'input' },

            { name: 'subject', 
              label: 'The email subject line', 
              type: 'input' },

            { name: 'body', 
              label: 'The body of your email', 
              type: 'textarea' }
        ],
    }
})