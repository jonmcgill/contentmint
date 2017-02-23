Cmint.createComponent({
    template: '<h3 class="thing" v-text="config._index + \' (\'+_uid+\')\'" :style="config.css"></h3>',
    config: {
        _name: 'thing',
        _display: 'Thing',
        _category: 'Content',
    }
})