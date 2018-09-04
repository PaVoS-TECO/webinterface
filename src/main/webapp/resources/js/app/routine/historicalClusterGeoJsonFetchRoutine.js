define(['requestor', 'parser'], function(Requestor, Parser) {
    function HistoricalClusterGeoJsonFetchRoutine(gridID, clusterID, property, time, steps, callback) {
        this.gridID = gridID; 
        this.clusterID = clusterID; 
        this.property = property; 
        this.time = time; 
        this.steps = steps;
        this.callback = callback;
    };

    HistoricalClusterGeoJsonFetchRoutine.prototype.run = function() {
        Requestor.requestHistoricalClusterGeoJson(this.gridID, 
                                        this.clusterID, 
                                        this.property, 
                                        this.time, 
                                        this.steps, 
                                        this.handleHistoricalClusterGeoJsonRequest.bind(this));
        console.log("START HistoricalClusterGeoJsonFetchRoutine");
    };

    HistoricalClusterGeoJsonFetchRoutine.prototype.handleHistoricalClusterGeoJsonRequest = function(response) {
        console.log("STOP HistoricalClusterGeoJsonFetchRoutine");
        this.callback(Parser.jsonStringToObject(response));
    };

    return HistoricalClusterGeoJsonFetchRoutine;
});