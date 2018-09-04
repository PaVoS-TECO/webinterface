define(['appManager', 'mapManager', 'liveClusterGeoJsonFetchRoutine', 'historicalClusterGeoJsonFetchRoutine', 'parser'], 
function(AppManager, MapManager, LiveClusterGeoJsonFetchRoutine, HistoricalClusterGeoJsonFetchRoutine, Parser) {
    var timer = null;
    var running = false;

    run = function() {
        console.log("FetchRoutine.running = " + running);
        if (!running) {
            running = true;
            var clusterGeoJsonFetchRoutine

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