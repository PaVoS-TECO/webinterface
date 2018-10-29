define(['jquery', 'appManager', 'bounds', 'recursiveRectangleGrid', 'gridUtil', 'mathUtil', 'util', 'geoJsonBuilder', 'gridUtil', 'utcDateTime', 'loadingOverlay'], 
function($, AppManager, Bounds, RecursiveRectangleGrid, GridUtil, MathUtil, Util, GeoJsonBuilder, GridUtil, UTCDateTime) {
    var GRID = new RecursiveRectangleGrid(new Bounds([-180, -85], [180, 85]), 3, 3, 8);
    var SENSORTYPES = ["temperature_fahrenheit", "temperature_celsius", "pollution"];
    var COLOR_RANGE_GRADIENTS = {
        "temperature": {
            "gradient": ["#FFFFFF", "#CB53AA", "#860083", "#1D008D", "#003FFF", "#26FEE6", "#FDFD00", "#FF1400", "#520002"],
            "_fahrenheit": [-58.0, 86.0],
            "_celsius": [-50.0, 30.0]
        },
        "pollution": {
            "gradient": ["#00ff00", "#ffff00", "#ff0000"],
            "": [0, 1]
        }
    };
    var EXPORTFORMATS = ["csv", "json"];

    var EDMS_URL = 
        AppManager.SERVER_URL 
        + ':' 
        + AppManager.EDMS_PORT 
        + '/';
    var CORE_URL = 
        AppManager.SERVER_URL 
        + ':' 
        + AppManager.CORE_PORT 
        + '/';
    var GRAFANA_URL = 
        AppManager.SERVER_URL 
        + ':' 
        + AppManager.GRAFANA_PORT 
        + '/' 
        + AppManager.GRAFANA_PANEL_TYPE
        + '/'
        + AppManager.GRAFANA_PANEL_ID
        + '/';

    requestGridBounds = function(callback, errorCallback) {
        callback(JSON.stringify([GRID.getBounds().getLowerLeft(), GRID.getBounds().getUpperRight()]));
    };

    requestGridID = function(callback, errorCallback) {
        callback(GRID.getGridID());
    };

    requestSensortypes = function(gridID, callback, errorCallback) {
        callback(JSON.stringify(SENSORTYPES));
    };

    requestColorGradients = function(callback, errorCallback) {
        callback(JSON.stringify(COLOR_RANGE_GRADIENTS));
    };

    requestLiveClusterGeoJson = function(gridID, clusterArray, property, callback, errorCallback) {
        var currentdate = new Date();
        var timestamp = new UTCDateTime(
            currentdate.getFullYear(),
            (currentdate.getMonth() + 1),
            currentdate.getDate(),
            currentdate.getHours(), 
            currentdate.getMinutes(), 
            currentdate.getSeconds()
        ); 

        var valueMin;
        var valueMax;
        if (AppManager.COLOR_GRADIENTS_RANGE[property] != undefined) {
            valueMin = AppManager.COLOR_GRADIENTS_RANGE[property][0];
            valueMax = AppManager.COLOR_GRADIENTS_RANGE[property][1];
        } else {
            valueMin = AppManager.COLOR_GRADIENTS_RANGE_DEFAULT[0];
            valueMax = AppManager.COLOR_GRADIENTS_RANGE_DEFAULT[1];
        }
        
        callback(
            JSON.stringify(
                GeoJsonBuilder.buildFromClusterArray(
                    GRID, 
                    clusterArray, 
                    timestamp.toString(), 
                    property, 
                    valueMin,
                    valueMax
                )
            )
        );
    };

    requestHistoricalClusterGeoJson = function(gridID, clusterArray, property, utcDateTimeArray, steps, callback, errorCallback) {
        var currentdate = new Date();
        var timestamp = new UTCDateTime(
            currentdate.getFullYear(),
            (currentdate.getMonth() + 1),
            currentdate.getDate(),
            currentdate.getHours(), 
            currentdate.getMinutes(), 
            currentdate.getSeconds()
        ); 
        
        var valueMin;
        var valueMax;
        if (AppManager.COLOR_GRADIENTS_RANGE[property] != undefined) {
            valueMin = AppManager.COLOR_GRADIENTS_RANGE[property][0];
            valueMax = AppManager.COLOR_GRADIENTS_RANGE[property][1];
        } else {
            valueMin = AppManager.COLOR_GRADIENTS_RANGE_DEFAULT[0];
            valueMax = AppManager.COLOR_GRADIENTS_RANGE_DEFAULT[1];
        }
        
        callback(
            JSON.stringify(
                [
                    GeoJsonBuilder.buildFromClusterArray(
                        GRID, 
                        clusterArray, 
                        timestamp.toString(), 
                        property, 
                        valueMin,
                        valueMax
                    )
                ]
            )
        );
    };

    requestSensorGeoJson = function(gridID, sensorID, property, callback, errorCallback) {
        var currentdate = new Date();
        var timestamp = new UTCDateTime(
            currentdate.getFullYear(),
            (currentdate.getMonth() + 1),
            currentdate.getDate(),
            currentdate.getHours(), 
            currentdate.getMinutes(), 
            currentdate.getSeconds()
        ); 
        
        var valueMin;
        var valueMax;
        if (AppManager.COLOR_GRADIENTS_RANGE[property] != undefined) {
            valueMin = AppManager.COLOR_GRADIENTS_RANGE[property][0];
            valueMax = AppManager.COLOR_GRADIENTS_RANGE[property][1];
        } else {
            valueMin = AppManager.COLOR_GRADIENTS_RANGE_DEFAULT[0];
            valueMax = AppManager.COLOR_GRADIENTS_RANGE_DEFAULT[1];
        }

        var value = MathUtil.randomInt(valueMin, valueMax);
        var coordinates = [MathUtil.randomInt(-180, 180), MathUtil.randomInt(-90, 90)];

        callback(
            JSON.stringify(
                { 
                    "type": "FeatureCollection", 
                    "timestamp": timestamp.toString(), 
                    "observationType": property, 
                    "features": [ 
                        { 
                            "type": "Feature", 
                            "properties": { 
                                "value": value, 
                                "sensorID": sensorID
                            }, 
                            "geometry": { 
                                "type": "Point", 
                                "coordinates": coordinates
                            } 
                        }
                    ] 
                }
            )
        );
    };

    requestSensorReport = function(sensorID, reason, callback, errorCallback) {
        callback();
    };

    requestLiveGraphForSensor = function(gridID, sensorID, sensorType) {
        AppManager.GRAFANA_URL = (
            GRAFANA_URL
            + 'main?'
            + this.formatParameters(['orgId', 'from', 'to', 'var-GridID'], [1, 'now/d', 'now', gridID])
            + '&'
            + this.formatParameters(['var-Sensor', 'var-ObservationType', 'panelId', 'theme'], [sensorID, sensorType, 2, 'light'])
        );

        console.log(AppManager.GRAFANA_URL);

        document.getElementById('graph').src = AppManager.GRAFANA_URL;
    }

    requestHistoricalGraphForSensor = function(from, to, gridID, sensorID, sensorType) {
        // Turn UTC DateTime into its absolute seconds form
        var fromDate = new Date(from.toString());
        var toDate = new Date(to.toString());
        var formatFrom = fromDate.getTime();
        var formatTo = toDate.getTime();

        // // Turn UTC DateTime into plain String of numbers.
        // var formatFrom = Util.replaceAll(from.toString(), ['-', 'T', ':', 'Z'], ['', '', '', '']);
        // var formatTo   = Util.replaceAll(to.toString(), ['-', 'T', ':', 'Z'], ['', '', '', '']);

        AppManager.GRAFANA_URL = (
            GRAFANA_URL
            + 'main?'
            + this.formatParameters(['orgId', 'from', 'to', 'var-GridID'], [1, formatFrom, formatTo, gridID])
            + '&'
            + this.formatParameters(['var-Sensor', 'var-ObservationType', 'panelId', 'theme'], [sensorID, sensorType, 2, 'light'])
        );

        console.log(AppManager.GRAFANA_URL);

        document.getElementById('graph').src = AppManager.GRAFANA_URL;
    }

    requestLiveGraphForCluster = function(gridID, clusterID, sensorType) {
        // The rows and columns for each grid level of the submitted clusterID

        var clusterArray = clusterID.split(':')[1].split('-');
        var formatClusterID = '';
        var i = -1;
        clusterArray.forEach(function(element) {
            i++;
            formatClusterID = formatClusterID + this.formatParameters(['var-ClusterLevel' + (i + 1)], [element]);
        });

        AppManager.GRAFANA_URL = (
            GRAFANA_URL
            + 'main?'
            + this.formatParameters(['orgId', 'from', 'to', 'var-GridID'], [1, 'now/d', 'now', gridID])
            + '&'
            + formatClusterID
            + '&'
            + this.formatParameters(['var-ObservationType', 'panelId', 'theme'], [sensorType, 2, 'light'])
        );

        console.log(AppManager.GRAFANA_URL);

        document.getElementById('graph').src = AppManager.GRAFANA_URL;
    };

    requestHistoricalGraphForCluster = function(from, to, gridID, clusterID, sensorType) {
        // The rows and columns for each grid level of the submitted clusterID
        var clusterArray = clusterID.split(':')[1].split('-');
        var formatClusterID = '';
        var i = -1;
        clusterArray.forEach(function(element) {
            i++;
            formatClusterID = formatClusterID + this.formatParameters(['var-ClusterLevel' + (i + 1)], [element]);
        });

        // Turn UTC DateTime into its absolute seconds form
        var fromDate = new Date(from.toString());
        var toDate = new Date(to.toString());
        var formatFrom = fromDate.getTime();
        var formatTo = toDate.getTime();

        // // Turn UTC DateTime into plain String of numbers.
        // var formatFrom = Util.replaceAll(from.toString(), ['-', 'T', ':', 'Z'], ['', '', '', '']);
        // var formatTo   = Util.replaceAll(to.toString(), ['-', 'T', ':', 'Z'], ['', '', '', '']);

        AppManager.GRAFANA_URL = (
            GRAFANA_URL
            + 'main?'
            + this.formatParameters(['orgId', 'from', 'to', 'var-GridID'], [1, formatFrom, formatTo, gridID])
            + '&'
            + formatClusterID
            + '&'
            + this.formatParameters(['var-ObservationType', 'panelId', 'theme'], [sensorType, 2, 'light'])
        );

        console.log(AppManager.GRAFANA_URL);

        document.getElementById('graph').src = AppManager.GRAFANA_URL;
    }

    requestExportFormats = function(callback, errorCallback) {
        callback(EXPORTFORMATS);
    };

    requestExport = function(extension, timeframe, observedProperty, clusters, callback, errorCallback) {
        callback('started');
    };

    requestExportStatus = function(extension, timeframe, observedProperty, clusters, callback, errorCallback) {
        callback('true');
    };

    requestDownload = function(extension, timeframe, observedProperty, clusters) {
        // var downloadID = Util.getHashCode(extension + timeframe + observedProperty + clusters);
        // var response = "downloadTest";
        // this.saveData(response, (downloadID + '.' + AppManager.DOWNLOAD_FORMAT));
    };

    xmlHttpRequest = function(type, url, asynchronous, callback, errorCallback) { };

    formatParameters = function(keyArray, valueArray) {
        var result = keyArray[0] + '=' + valueArray[0];
        for (i = 1; i < keyArray.length; i++) {
            result = result + '&' + keyArray[i] + '=' + valueArray[i];
        }
        return result;
    };

    saveData = function(blob, fileName) {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";

        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return {
        requestGridBounds,
        requestGridID,
        requestSensortypes,
        requestColorGradients,
        requestLiveClusterGeoJson,
        requestHistoricalClusterGeoJson,
        requestSensorGeoJson,
        requestSensorReport,
        requestLiveGraphForSensor,
        requestHistoricalGraphForSensor,
        requestLiveGraphForCluster,
        requestHistoricalGraphForCluster,
        requestExportFormats,
        requestExport,
        requestExportStatus,
        requestDownload,
        xmlHttpRequest,
        formatParameters,
        saveData
    }
});