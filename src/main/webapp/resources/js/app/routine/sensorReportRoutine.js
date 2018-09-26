define(['requestor'], function(Requestor) {
    function SensorReportRoutine(sensorID, reason) {
        this.sensorID = sensorID;
        this.reason = reason;
    };

    SensorReportRoutine.prototype.run = function() {
        Requestor.requestSensorReport(
            this.sensorID,
            this.reason,
            this.handleSensorReportRequest.bind(this),
            this.handleSensorReportRequestError.bind(this)
        );
        console.log("START SensorReportRoutine");
    };

    SensorReportRoutine.prototype.handleSensorReportRequest = function(response) {
        console.log("STOP SensorReportRoutine");
        console.log(
            "Sensor '"
            + this.sensorID 
            + "' with the following reason: '" 
            + this.reason 
            + "' was successfully reported ");
    };

    SensorReportRoutine.prototype.handleSensorReportRequestError = function() {
        console.log("STOP SensorReportRoutine");
        console.error(
            "Sensor '" 
            + this.sensorID 
            + "' with the following reason: '" 
            + this.reason 
            + "' couldn't be reported"
        );
    };

    return SensorReportRoutine;
})