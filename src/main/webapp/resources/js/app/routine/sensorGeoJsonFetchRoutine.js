define(['requestor', 'parser'], function(Requestor, Parser) {
    function SensorGeoJsonFetchRoutine(gridID, clusterID, property, callback) {
        this.gridID = gridID; 
        this.clusterID = clusterID; 
        this.property = property;
        this.callback = callback;
    };

    SensorGeoJsonFetchRoutine.prototype.run = function() {
        Requestor.requestSensorGeoJson(this.gridID, 
                                       this.clusterID, 
                                       this.property,
                                       this.handleSensorGeoJsonRequest.bind(this));
        console.log("START SensorGeoJsonFetchRoutine");
    };

    SensorGeoJsonFetchRoutine.prototype.handleSensorGeoJsonRequest = function(response) {
        console.log("STOP SensorGeoJsonFetchRoutine");
        this.callback(Parser.jsonStringToObject(response));
    };

    return SensorGeoJsonFetchRoutine;
})