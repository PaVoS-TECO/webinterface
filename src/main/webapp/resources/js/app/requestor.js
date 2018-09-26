define(['jquery', 'appManager', 'util', 'gridUtil', 'loadingOverlay'], function($, AppManager, Util, GridUtil) {
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
        this.xmlHttpRequest(
            "GET",
            (CORE_URL
                + 'getGridBounds?'),
            true,
            callback,
            errorCallback
        );
    };

    requestGridID = function(callback, errorCallback) {
        this.xmlHttpRequest(
            "GET",
            (CORE_URL
                + 'getGridID?'),
            true,
            callback,
            errorCallback
        );
    };

    requestSensortypes = function(gridID, callback, errorCallback) {
        this.xmlHttpRequest(
            "GET",
            (CORE_URL
                + 'getObservationTypes?'
                + this.formatParameters(['gridID'],
                                        [gridID])),
            true,
            callback, 
            errorCallback
        );
    };

    requestColorGradients = function(callback, errorCallback) {
        this.xmlHttpRequest(
            "GET",
            (CORE_URL
                + 'getAllGradients?'),
            true,
            callback, 
            errorCallback
        );
    };

    requestLiveClusterGeoJson = function(gridID, clusterArray, property, callback, errorCallback) {
        var valueArray = [
            gridID, 
            Util.concat(GridUtil.clusterArrayToStringArray(clusterArray), ','),
            property
        ]

        this.xmlHttpRequest(
            "GET",
            (CORE_URL
                + 'getGeoJsonCluster?'
                + this.formatParameters(['gridID', 'clusterID', 'property'],
                                        valueArray)),
            true,
            callback, 
            errorCallback
        );
    };

    requestHistoricalClusterGeoJson = function(gridID, clusterArray, property, utcDateTimeArray, steps, callback, errorCallback) {
        var valueArray = [
            gridID, 
            Util.concat(GridUtil.clusterArrayToStringArray(clusterArray), ','),
            property,
            Util.concat(utcDateTimeArray, ','),
            steps
        ]

        this.xmlHttpRequest(
            "GET",
            (CORE_URL
                + 'getGeoJsonCluster?'
                + this.formatParameters(['gridID', 'clusterID', 'property', 'time', 'steps'],
                                        valueArray)),
            true,
            callback, 
            errorCallback
        );
    };

    requestSensorGeoJson = function(gridID, sensorID, property, callback, errorCallback) {
        this.xmlHttpRequest(
            "GET",
            (CORE_URL
                + 'getGeoJsonSensor?'
                + this.formatParameters(['gridID', 'sensorID', 'property'],
                                        [gridID, sensorID, property])),
            true,
            callback, 
            errorCallback
        );
    };

    requestSensorReport = function(sensorID, reason, callback, errorCallback) {
        this.xmlHttpRequest(
            "GET",
            (CORE_URL
                + 'reportSensor?'
                + this.formatParameters(['sensorID', 'reason'],
                                        [sensorID, reason])),
            true,
            callback, 
            errorCallback
        );
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
        this.xmlHttpRequest(
            "GET",
            (EDMS_URL
                + 'edms/get?requestType=getExtensions'),
            true,
            callback, 
            errorCallback
        );
    };

    requestExport = function(extension, timeframe, observedProperty, clusters, callback, errorCallback) {
        var downloadID = Util.getHashCode(extension + timeframe + observedProperty + clusters);
       
        var array = [downloadID,
                     extension, 
                     Util.concat([timeframe[0].toString(), timeframe[1].toString()], ','),
                     observedProperty,
                     Util.concat(GridUtil.clusterArrayToStringArray(clusters), ',')];

        this.xmlHttpRequest(
            "GET",
            (EDMS_URL
                + 'edms/get?requestType=newExport&'
                + this.formatParameters(['downloadID', 'extension', 'timeFrame', 'observedProperties', 'clusters'],
                                        array)),
            true,
            callback, 
            errorCallback
        );
    };

    requestExportStatus = function(extension, timeframe, observedProperty, clusters, callback, errorCallback) {
        var downloadID = Util.getHashCode(extension + timeframe + observedProperty + clusters);

        this.xmlHttpRequest(
            "GET",
            (EDMS_URL
                + 'edms/get?requestType=getStatus'
                + '&downloadID='
                + downloadID),
            true,
            callback, 
            errorCallback
        );
    };

    requestDownload = function(extension, timeframe, observedProperty, clusters) {
        var downloadID = Util.getHashCode(extension + timeframe + observedProperty + clusters);

        var requestUrl =
            (EDMS_URL
            + 'edms/get?requestType=tryDownload'
            + '&downloadID='
            + downloadID);

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", requestUrl);
        xmlHttp.responseType = "blob";

        var _this = this;
        xmlHttp.onload = function () {
            _this.saveData(this.response, (downloadID + '.' + AppManager.DOWNLOAD_FORMAT));
        };
        xmlHttp.timeout = AppManager.HTTP_REQUEST_TIMEOUT;
        xmlHttp.ontimeout = function() {
            xmlHttp.abort;
            console.log("XMLHttpRequest Timeout >>>>> " + requestURL);
        }
        xmlHttp.onerror = function() {
            xmlHttp.abort;
            console.log("XMLHttpRequest Error >>>>> " + requestURL);
        }
        xmlHttp.send();
    };

    xmlHttpRequest = function(type, url, asynchronous, callback, errorCallback) {
        var xmlHttp = new XMLHttpRequest();
        console.log("XMLHttpRequest Pending >>> " + url);
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status === 200) {
                    console.log("XMLHttpRequest Success >>> " + url + " >>> " + xmlHttp.responseText);
                    callback(xmlHttp.responseText);
                } else if (xmlHttp.status >= 400) {
                    xmlHttp.abort;
                    console.error("XMLHttpRequest Error >>> " + url + " >>> " + xmlHttp.responseText);
                    errorCallback();
                }
            }
        }
        xmlHttp.open(type, url, asynchronous);
        xmlHttp.timeout = AppManager.HTTP_REQUEST_TIMEOUT;
        xmlHttp.ontimeout = function() {
            xmlHttp.abort;
            console.error("XMLHttpRequest Timeout >>> " + url);
            errorCallback();
        }
        xmlHttp.onerror = function() {
            xmlHttp.abort;
            console.error("XMLHttpRequest Error >>> " + url);
            errorCallback();
        }
        xmlHttp.send();
    };

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

    startLoadAnimation = function(timeout) {
        $.LoadingOverlay("show", {
            image          : "resources/data/PaVoSLogo-Icon.png",
            imageAnimation : "1000ms fadein",
            size           : 100,
            minSize        : 50,
            maxSize        : 200,
            fade           : [400, 400]
        });

        if (timeout != null) {
            var _this = this;
            setTimeout(function() {
                _this.stopLoadAnimation();
            }, Number(timeout));
        }
    };

    stopLoadAnimation = function() {
        $.LoadingOverlay("hide");
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
        saveData,
        startLoadAnimation,
        stopLoadAnimation
    }
});