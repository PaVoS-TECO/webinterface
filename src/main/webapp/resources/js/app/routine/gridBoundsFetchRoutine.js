define(['requestor', 'parser'], function(Requestor, Parser) {
    function GridBoundsFetchRoutine(callback) {
        this.callback = callback;
    };

    GridBoundsFetchRoutine.prototype.run = function() {
        Requestor.requestGridBounds(
            this.handleGridBoundsRequest.bind(this), 
            this.handleGridBoundsRequestError.bind(this)
        );
        console.log("START GridBoundsFetchRoutine");
    };

    GridBoundsFetchRoutine.prototype.handleGridBoundsRequest = function(response) {
        console.log("STOP GridBoundsFetchRoutine");
        this.callback(Parser.parseJsonToBounds(response));
    };

    GridBoundsFetchRoutine.prototype.handleGridBoundsRequestError = function() {
        console.log("STOP GridBoundsFetchRoutine");
        console.error("Grid Bounds couldn't be fetched");
    };

    return GridBoundsFetchRoutine;
})