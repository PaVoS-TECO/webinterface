define(['requestor', 'parser'], function(Requestor, Parser) {
    function GridBoundsFetchRoutine(callback) {
        this.callback = callback;
    };

    GridBoundsFetchRoutine.prototype.run = function() {
        Requestor.requestGridBounds(this.handleGridBoundsRequest.bind(this));
        console.log("START GridBoundsFetchRoutine");
    };

    GridBoundsFetchRoutine.prototype.handleGridBoundsRequest = function(response) {
        console.log("STOP GridBoundsFetchRoutine");
        this.callback(Parser.parseJsonToBounds(response));
    };

    return GridBoundsFetchRoutine;
})