define(['requestor', 'parser'], function(Requestor, Parser) {
    function ColorGradientFetchRoutine(callback) {
        this.callback = callback;
    };

    ColorGradientFetchRoutine.prototype.run = function() {
        Requestor.requestColorGradients(
            this.handleColorGradientsRequest.bind(this), 
            this.handleColorGradientsRequestError.bind(this)
        );
        console.log("START ColorGradientFetchRoutine");
    };

    ColorGradientFetchRoutine.prototype.handleColorGradientsRequest = function(response) {
        console.log("STOP ColorGradientFetchRoutine");
        this.callback(Parser.jsonStringToObject(response));
    }

    ColorGradientFetchRoutine.prototype.handleColorGradientsRequestError = function() {
        console.error("Color Gradients couldn't be fetched");
        console.log("STOP ColorGradientFetchRoutine");
    }

    return ColorGradientFetchRoutine;
})