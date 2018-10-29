define(['jquery', 'appManager', 'mapManager', 'liveClusterGeoJsonFetchRoutine', 'historicalClusterGeoJsonFetchRoutine', 'dynamicHtmlBuilder', 'parser', 'tableUtil', 'util'], 
function($, AppManager, MapManager, LiveClusterGeoJsonFetchRoutine, HistoricalClusterGeoJsonFetchRoutine, DynamicHtmlBuilder, Parser, TableUtil, Util) {
    var timer = null;
    var running = false;

    run = function(liveMode, gridID, clusterArray, selectedSensortype, selectedTimeframe) {
        console.log("FetchRoutine.running = " + running);
        if (!running) {
            running = true;
            var clusterGeoJsonFetchRoutine;

            if (liveMode) {
                clusterGeoJsonFetchRoutine =
                    new LiveClusterGeoJsonFetchRoutine(
                        gridID,
                        clusterArray,
                        selectedSensortype,
                        handleFetchResponse,
                        handleFetchResponseError
                    );
            } else {
                clusterGeoJsonFetchRoutine = 
                    new HistoricalClusterGeoJsonFetchRoutine(
                        gridID,
                        clusterArray,
                        selectedSensortype,
                        selectedTimeframe,
                        AppManager.HISTORICAL_SNAPSHOT_AMOUNT,
                        handleFetchResponse,
                        handleFetchResponseError
                    );
            }

            console.log("START FetchRoutine");
            clusterGeoJsonFetchRoutine.run();
        }
    };

    handleFetchResponse = function(response) {
        console.log("STOP Fetchroutine");

        AppManager.GEOJSON_ARRAY = response;
        
        MapManager.updateLayerArray(AppManager.GEOJSON_ARRAY);
        MapManager.displayLayer(0);

        AppManager.CURRENT_CONTENT_TABLE_ARRAY = Parser.parseGeoJsonArrayToContentTableArray(AppManager.GEOJSON_ARRAY);

        AppManager.CONTENT_TABLE = [
            [
                "id", 
                AppManager.APP_STATE.getSelectedSensortype()
            ],
            AppManager.CURRENT_CONTENT_TABLE_ARRAY[0]
        ];

        $('#contenttable tr').remove();
        DynamicHtmlBuilder.buildTableContentFromNestedArray(
            '#contenttable', 
            AppManager.CONTENT_TABLE[0], 
            Util.fillNestedArray(AppManager.CONTENT_TABLE[1], "", 2)
        );
        TableUtil.addRowClickListener("#contenttable", TableUtil.handleContentTableClick);

        running = false;
    };

    handleFetchResponseError = function() {
        console.log("STOP Fetchroutine");
        console.error("Fetchroutine wasn't succesfull");
        running = false;
    }

    isRunning = function() {
        return this.running;
    }

    return {
        run,
        isRunning
    }
})