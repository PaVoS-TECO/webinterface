define(['requestor', 'parser'], function(Requestor, Parser) {
    function HistoricalClusterGeoJsonFetchRoutine(gridID, clusterID, property, time, steps, callback, errorCallback) {
        this.gridID = gridID; 
        this.clusterID = clusterID; 
        this.property = property; 
        this.time = time; 
        this.steps = steps;
        this.callback = callback;
        this.errorCallback = errorCallback;
    };

    HistoricalClusterGeoJsonFetchRoutine.prototype.run = function() {
        Requestor.requestHistoricalClusterGeoJson(
            this.gridID, 
            this.clusterID, 
            this.property, 
            this.time, 
            this.steps, 
            this.handleHistoricalClusterGeoJsonRequest.bind(this),
            this.handleHistoricalClusterGeoJsonRequestError.bind(this)
        );
        console.log("START HistoricalClusterGeoJsonFetchRoutine");
    };

    HistoricalClusterGeoJsonFetchRoutine.prototype.handleHistoricalClusterGeoJsonRequest = function(response) {
        console.log("STOP HistoricalClusterGeoJsonFetchRoutine");
        this.callback(Parser.jsonStringToObject(response));
    };

    HistoricalClusterGeoJsonFetchRoutine.prototype.handleHistoricalClusterGeoJsonRequestError = function() {
        console.log("STOP HistoricalClusterGeoJsonFetchRoutine");
        console.error(
            "Historical Cluster GeoJson for grid identifier '" 
            + this.gridID 
            + "', cluster identifier(s) '"
            + this.clusterID
            + "', sensortype '"
            + this.property
            + "', timeframe '"
            + this.time
            + "' and snapshots '"
            + this.steps
            + "' couldn't be fetched"
        );
        this.errorCallback();
    };

    return HistoricalClusterGeoJsonFetchRoutine;
});