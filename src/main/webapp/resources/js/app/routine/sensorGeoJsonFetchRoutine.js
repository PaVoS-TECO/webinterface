define(['requestor', 'parser'], function(Requestor, Parser) {
    function SensorGeoJsonFetchRoutine(gridID, clusterID, property, callback) {
        this.gridID = gridID; 
        this.clusterID = clusterID; 
        this.property = property;
        this.callback = callback;
    };

    SensorGeoJsonFetchRoutine.prototype.run = function() {
        Requestor.requestSensorGeoJson(
            this.gridID, 
            this.clusterID, 
            this.property,
            this.handleSensorGeoJsonRequest.bind(this),
            this.handleSensorGeoJsonRequestError.bind(this)
        );
        console.log("START SensorGeoJsonFetchRoutine");
    };

    SensorGeoJsonFetchRoutine.prototype.handleSensorGeoJsonRequest = function(response) {
        console.log("STOP SensorGeoJsonFetchRoutine");
        this.callback(Parser.jsonStringToObject(response));
    };

    SensorGeoJsonFetchRoutine.prototype.handleSensorGeoJsonRequestError = function() {
        console.log("STOP SensorGeoJsonFetchRoutine");
        console.error(
            "Sensor GeoJson for grid identifier '" 
            + this.gridID 
            + "', cluster identifier(s) '"
            + this.clusterID
            + "' and sensortype '"
            + this.property
            + "' couldn't be fetched"
        );
    };

    return SensorGeoJsonFetchRoutine;
})