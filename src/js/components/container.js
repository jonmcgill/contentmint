Cmint.createComponent({
    template: '\
        <div class="Container">\
            <context :children="config.container" data-context-name="container"></context>\
        </div>',
    config: {
        _name: 'container',
        _display: 'Container',
        _category: 'Layout',
        container: []
    }
})