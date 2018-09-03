define(['requestor', 'parser'], function(Requestor, Parser) {
    function ColorGradientFetchRoutine(callback) {
        this.callback = callback;
    };

    ColorGradientFetchRoutine.prototype.run = function() {
        Requestor.requestColorGradients(this.handleColorGradientsRequest.bind(this));
        console.log("START ColorGradientFetchRoutine");
    };

    ColorGradientFetchRoutine.prototype.handleColorGradientsRequest = function(response) {
        console.log("STOP ColorGradientFetchRoutine");
        this.callback(Parser.jsonStringToObject(response));
    }

    return ColorGradientFetchRoutine;
})