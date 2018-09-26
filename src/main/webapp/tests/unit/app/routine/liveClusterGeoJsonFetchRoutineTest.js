define(['requestor', 'parser'], function(Requestor, Parser) {
    function LiveClusterGeoJsonFetchRoutine(gridID, clusterID, property, callback) {
        this.gridID = gridID; 
        this.clusterID = clusterID; 
        this.property = property;
        this.callback = callback;
    };

    LiveClusterGeoJsonFetchRoutine.prototype.run = function() {
        Requestor.requestLiveClusterGeoJson(this.gridID, 
                                            this.clusterID, 
                                            this.property,
                                            this.handleLiveClusterGeoJsonRequest.bind(this));
        console.log("START LiveClusterGeoJsonFetchRoutine");
    };

    LiveClusterGeoJsonFetchRoutine.prototype.handleLiveClusterGeoJsonRequest = function(response) {
        console.log("STOP LiveClusterGeoJsonFetchRoutine");
        this.callback([Parser.jsonStringToObject(response)]);
    };

    return LiveClusterGeoJsonFetchRoutine;
});