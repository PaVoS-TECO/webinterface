define(['requestor', 'parser'], function(Requestor, Parser) {
    function LiveClusterGeoJsonFetchRoutine(gridID, clusterID, property, callback, errorCallback) {
        this.gridID = gridID; 
        this.clusterID = clusterID; 
        this.property = property;
        this.callback = callback;
        this.errorCallback = errorCallback;
    };

    LiveClusterGeoJsonFetchRoutine.prototype.run = function() {
        Requestor.requestLiveClusterGeoJson(
            this.gridID, 
            this.clusterID, 
            this.property,
            this.handleLiveClusterGeoJsonRequest.bind(this),
            this.handleLiveClusterGeoJsonRequestError.bind(this)
        );
        console.log("START LiveClusterGeoJsonFetchRoutine");
    };

    LiveClusterGeoJsonFetchRoutine.prototype.handleLiveClusterGeoJsonRequest = function(response) {
        console.log("STOP LiveClusterGeoJsonFetchRoutine");
        this.callback([Parser.jsonStringToObject(response)]);
    };

    LiveClusterGeoJsonFetchRoutine.prototype.handleLiveClusterGeoJsonRequestError = function() {
        console.log("STOP LiveClusterGeoJsonFetchRoutine");
        console.error(
            "Live Cluster GeoJson for grid identifier '" 
            + this.gridID 
            + "', cluster identifier(s) '"
            + this.clusterID
            + "' and sensortype '"
            + this.property
            + "' couldn't be fetched"
        );
        this.errorCallback();
    };

    return LiveClusterGeoJsonFetchRoutine;
});