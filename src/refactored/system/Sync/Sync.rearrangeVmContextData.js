// When components are rearranged on stage using dragula, we need to revert what dragula
// did to the DOM and then give control back over to the Vm data. This function
// takes the dragged data and splices it into the dropped context data.
// Both parameters are the result of Sync.getVmContextData.
Cmint.Sync.rearrangeVmContextData = function(fromData, toData) {

    toData.context.splice(toData.index, 0, fromData.context.splice(fromData.index, 1)[0]);
    Cmint.Util.debug('rearranging Vm context data');

}