define(['requestor', 'parser'], function(Requestor, Parser) {
    function ExportFormatFetchRoutine(callback) {
        this.callback = callback;
    };

    ExportFormatFetchRoutine.prototype.run = function() {
        Requestor.requestExportFormats(
            this.handleExportFormatRequest.bind(this), 
            this.handleExportFormatRequestError.bind(this)
        );
        console.log("START ExportFormatFetchRoutine");
    };

    ExportFormatFetchRoutine.prototype.handleExportFormatRequest = function(response) {
        console.log("STOP ExportFormatFetchRoutine");
        this.callback(Parser.separatedToArray(response, ','));
    };

    ExportFormatFetchRoutine.prototype.handleExportFormatRequestError = function() {
        console.error("Export Formats couldn't be fetched");
        console.log("STOP ExportFormatFetchRoutine");
    }

    return ExportFormatFetchRoutine;
})