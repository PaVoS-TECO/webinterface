define(['requestor', 'parser'], function(Requestor, Parser) {
    function SensorTypeFetchRoutine(gridID, callback) {
        this.gridID = gridID;
        this.callback = callback;
    }

    SensorTypeFetchRoutine.prototype.run = function() {
        Requestor.requestSensortypes(
            this.gridID,          
            this.handleSensorTypesRequest.bind(this),    
            this.handleSensorTypesRequestError.bind(this)
        );
        console.log("START SensorTypeFetchRoutine");
    }

    SensorTypeFetchRoutine.prototype.handleSensorTypesRequest = function(response) {
        console.log("STOP SensorTypeFetchRoutine");
        this.callback(Parser.arrayStringToArray(response));
    }

    SensorTypeFetchRoutine.prototype.handleSensorTypesRequestError = function() {
        console.log("STOP SensorTypeFetchRoutine");
        console.error(
            "Sensortypes for the grid identifier '" 
            + this.gridID 
            + "' couldn't be fetched"
        );
    }

    return SensorTypeFetchRoutine;
})