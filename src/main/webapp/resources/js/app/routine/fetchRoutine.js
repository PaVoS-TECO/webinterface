define(['jquery', 'appManager', 'mapManager', 'liveClusterGeoJsonFetchRoutine', 'historicalClusterGeoJsonFetchRoutine', 'dynamicHtmlBuilder', 'parser'], 
function($, AppManager, MapManager, LiveClusterGeoJsonFetchRoutine, HistoricalClusterGeoJsonFetchRoutine, DynamicHtmlBuilder, Parser) {
    var timer = null;
    var running = false;

    run = function() {
        console.log("FetchRoutine.running = " + running);
        if (!running) {
            running = true;
            var clusterGeoJsonFetchRoutine;

            if (AppManager.LIVE_MODE_ENABLED) {
                clusterGeoJsonFetchRoutine =
                    new LiveClusterGeoJsonFetchRoutine(
                        AppManager.GRID.getGridID(),
                        AppManager.GRID.getClustersContainedInBounds(AppManager.BOUNDS, AppManager.GRID_LEVEL),
                        AppManager.APP_STATE.getSelectedSensortype(),
                        handleFetchResponse
                    );
            } else {
                clusterGeoJsonFetchRoutine = 
                    new HistoricalClusterGeoJsonFetchRoutine(
                        AppManager.GRID.getGridID(),
                        AppManager.GRID.getClustersContainedInBounds(AppManager.BOUNDS, AppManager.GRID_LEVEL),
                        AppManager.APP_STATE.getSelectedSensortype(),
                        AppManager.APP_STATE.getSelectedTimeframe(),
                        AppManager.HISTORICAL_SNAPSHOT_AMOUNT,
                        handleFetchResponse
                    );
            }

            console.log("START FetchRoutine");
            clusterGeoJsonFetchRoutine.run();
        }
    };

    handleFetchResponse = function(response) {
        console.log("STOP Fetchroutine");
        
        MapManager.updateLayerArray(response);
        MapManager.displayLayer(0);

        var tableContentArray = [];
        var contentArray = [];
        if (response[0] != undefined) {
            var featureArray = response[0]["features"];
            for (featureIndex = 0; featureIndex < featureArray.length; featureIndex++) {
                contentArray = featureArray[featureIndex]["properties"]["content"];
                for (contentIndex = 0; contentIndex < contentArray.length; contentIndex++) {
                    tableContentArray.push(contentArray[contentIndex]);
                    tableContentArray.push("");
                }
            }
        }
        AppManager.CONTENT_TABLE = [["id", AppManager.APP_STATE.getSelectedSensortype()], tableContentArray];
        $('#sensortable tr').remove();
        DynamicHtmlBuilder.buildTableContentFromArray('#sensortable', AppManager.CONTENT_TABLE[0], AppManager.CONTENT_TABLE[1]);

        running = false;
    };

    start = function() {
        // clearInterval(timer);
        // if (AppManager.LIVE_MODE_ENABLED) {
        //     timer = setInterval(function() {
        //         this.run();
        //     }, AppManager.APP_STATE.getSelectedLiveRefreshInterval());
        // } else {
        //     timer = setInterval(function() {

        //     }, AppManager.APP_STATE.getSelectedHistoricalRefreshInterval());
        // }
    };

    stop = function() {
        clearInterval(timer);
        timer = null;
    };

    return {
        run,
        start,
        stop
    }
})