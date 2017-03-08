Cmint.AppFn.updateStageCustomComponents = function(component) {
    
    if (component.config.custom && component.environment === 'stage') {
        Cmint.Bus.$on('updateCustom', function(data) {
            if (component.config.display === data.oldCustomName) {
                Cmint.Util.debug('updated staged custom component');
                vmData = Cmint.Sync.getVmContextData(component.config.index, Cmint.App.stage);
                vmData.context.splice(vmData.index, 1, Cmint.Util.copyObject(data));
            }
        })
    }

}