define(['appManager', 'parser', 'leafletUtil', 'leaflet'], function(AppManager, Parser, LeafletUtil) {
    var layerArray = [];
    var timestampArray = [];
    var currentLayer = null;
    var currentIndex = 0;

    updateLayerArray = function(geoJsonArray) {
        layerArray = [];
        timestampArray = [];
        currentIndex = 0;
        for (i = 0; i < geoJsonArray.length; i++) {
            timestampArray.push(geoJsonArray[i]["timestamp"]);
            console.log(timestampArray);
            console.log("looped");
            layerArray.push(LeafletUtil.createLayerFromGeoJson(JSON.parse(JSON.stringify(geoJsonArray[i])), this.applyColorGradient));
        }
    };

    displayLayer = function(index) {
        if ((currentLayer != null)
            && (currentLayer != undefined)) {
            AppManager.MAP.removeLayer(currentLayer);
        }
        if ((0 <= index) && (index <= (layerArray.length - 1))) {
            currentIndex = index;
        } else {
            currentIndex = 0;
        }
        currentLayer = layerArray[currentIndex];
        if ((currentLayer != null)
            && (currentLayer != undefined)) {
            currentLayer.addTo(AppManager.MAP);
        }
    };

    displayNextLayer = function() {
        if (currentLayer != null) {
            AppManager.MAP.removeLayer(currentLayer);
        }
        currentIndex = (currentIndex + 1) % layerArray.length;
        currentLayer = layerArray[currentIndex];
        if ((currentLayer != null)
            && (currentLayer != undefined)) {
            currentLayer.addTo(AppManager.MAP);
        }
    };

    getCurrentTimestamp = function() {
        return timestampArray[currentIndex];
    };

    applyColorGradient = function(feature, layer) {
        var min;
        var max;
        var gradient;

        if (AppManager.COLOR_GRADIENTS_RANGE[AppManager.APP_STATE.getSelectedSensortype()] == undefined
            || AppManager.COLOR_GRADIENTS[AppManager.APP_STATE.getSelectedSensortype()] == undefined) {

            min = AppManager.COLOR_GRADIENTS_RANGE_DEFAULT[0];
            max = AppManager.COLOR_GRADIENTS_RANGE_DEFAULT[1];
            gradient = AppManager.COLOR_GRADIENTS_DEFAULT;

        } else {
            min = AppManager.COLOR_GRADIENTS_RANGE[AppManager.APP_STATE.getSelectedSensortype()][0];
            max = AppManager.COLOR_GRADIENTS_RANGE[AppManager.APP_STATE.getSelectedSensortype()][1];
            gradient = AppManager.COLOR_GRADIENTS[AppManager.APP_STATE.getSelectedSensortype()];
        }

        layer.setStyle(
            LeafletUtil.getStyle(
                min,
                max,
                Number(feature['properties']['value']), 
                gradient,
                AppManager.FILL_COLOR_OPACITY, 
                AppManager.BORDER_COLOR_OPACITY, 
                AppManager.BORDER_WEIGHT));
    };

    return {
        updateLayerArray,
        displayLayer,
        displayNextLayer,
        getCurrentTimestamp,
        applyColorGradient
    };
});