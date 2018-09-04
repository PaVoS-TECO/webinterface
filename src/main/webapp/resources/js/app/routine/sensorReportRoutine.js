define(['requestor'], function(Requestor) {
    function SensorReportRoutine(sensorID, reason, callback) {
        this.sensorID = sensorID;
        this.reason = reason;
        this.callback = callback;
    };

    SensorReportRoutine.prototype.run = function() {
        Requestor.requestSensorReport(this.sensorID,
                                      this.reason,
                                      this.handleSensorReportRequest.bind(this));
        console.log("START SensorReportRoutine");
    };

    SensorReportRoutine.prototype.handleSensorReportRequest = function(response) {
        console.log("STOP SensorReportRoutine");
        this.callback(response);
    };

    return SensorReportRoutine;
})