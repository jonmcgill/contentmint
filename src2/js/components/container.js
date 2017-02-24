Cmint.createComponent({
    template: '\
        <div class="Container" style="border:1px solid black;padding:16px;">\
            <context :children="config.container" data-context-name="container"></context>\
        </div>',
    config: {
        _name: 'container',
        _display: 'Container',
        _category: 'Layout',
        container: [
            { _name: 'thing', _display: 'Thing', _category: 'Content' }
        ]
    }
})