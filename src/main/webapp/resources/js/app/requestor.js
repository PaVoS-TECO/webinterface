define(['jquery', 'appManager', 'util', 'gridUtil', 'loadingOverlay'], function($, AppManager, Util, GridUtil) {
    var EDMS_URL    = AppManager.SERVER_URL + ':' + AppManager.EDMS_PORT + '/';
    var CORE_URL    = AppManager.SERVER_URL + ':' + AppManager.CORE_PORT + '/';
    var GRAFANA_URL = AppManager.SERVER_URL + ':' + AppManager.GRAFANA_PORT + '/';

    requestGridBounds = function(callback) {
        this.xmlHttpRequest(
            "GET",
            (CORE_URL
                + 'getGridBounds?'),
            true,
            callback
        );
    };

    requestGridID = function(callback) {
        this.xmlHttpRequest(
            "GET",
            (CORE_URL
                + 'getGridID?'),
            true,
            callback);
    };

    requestSensortypes = function(gridID, callback) {
        this.xmlHttpRequest(
            "GET",
            (CORE_URL
                + 'getObservationTypes?'
                + this.formatParameters(['gridID'],
                                        [gridID])),
            true,
            callback);
    };

    requestColorGradients = function(callback) {
        this.xmlHttpRequest(
            "GET",
            (CORE_URL
                + 'getAllGradients?'),
            true,
            callback);
    };

    requestLiveClusterGeoJson = function(gridID, clusterArray, property, callback) {
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
            callback);
    };

    requestHistoricalClusterGeoJson = function(gridID, clusterArray, property, utcDateTimeArray, steps, callback) {
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
            callback);
    };

    requestSensorGeoJson = function(gridID, sensorID, property, callback) {
        this.xmlHttpRequest(
            "GET",
            (CORE_URL
                + 'getGeoJsonSensor?'
                + this.formatParameters(['gridID', 'sensorID', 'property'],
                                        [gridID, sensorID, property])),
            true,
            callback);
    };

    requestSensorReport = function(sensorID, reason, callback) {
        this.xmlHttpRequest(
            "GET",
            (CORE_URL
                + 'reportSensor?'
                + this.formatParameters(['sensorID', 'reason'],
                                        [sensorID, reason])),
            true,
            callback);
    };

    requestGraph = function(live, from, to, gridID, clusterID, sensorIDs, sensorType) {
        // The rows and columns for each grid level of the submitted clusterID
        var clusterArray = clusterID.split(':')[1].split('-');
        var formatClusterID = '';
        for (i = 0; i < clusterArray.length; i++) {
            formatClusterID = formatClusterID + this.formatParameters(['var-ClusterLevel' + (i + 1)], [clusterArray[i]]);
        }

        if (live) {
            AppManager.GRAFANA_URL = GRAFANA_URL
                + 'main?'
                + this.formatParameters(['orgId', 'from', 'to', 'var-GridID'], [1, 'now/d', 'now', gridID]);
                + '&'
                + formatClusterID
                + '&'
                + this.formatParameters(['var-Sensor', 'var-ObservationType', 'panelId', 'theme'], [sensorIDs, sensorType, 2, 'light']);
        } else {
            // Turn UTC DateTime into plain String of numbers.
            var formatFrom = Util.replaceAll(from.toString(), ['-', 'T', ':', 'Z'], ['', '', '', '']);
            var formatTo   = Util.replaceAll(to.toString(), ['-', 'T', ':', 'Z'], ['', '', '', '']);

            AppManager.GRAFANA_URL = GRAFANA_URL
                + 'main?'
                + this.formatParameters(['orgId', 'from', 'to', 'var-GridID'], [1, formatFrom, formatTo, gridID]);
                + '&'
                + formatClusterID
                + '&'
                + this.formatParameters(['var-Sensor', 'var-ObservationType', 'panelId', 'theme'], [sensorIDs, sensorType, 2, 'light']);
        }
    };

    requestExportFormats = function(callback) {
        this.xmlHttpRequest(
            "GET",
            (EDMS_URL
                + 'edms/get?requestType=getExtensions'),
            true,
            callback);
    };

    requestExport = function(extension, timeframe, observedProperty, clusters, callback) {
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
            callback);
    };

    requestExportStatus = function(extension, timeframe, observedProperty, clusters, callback) {
        var downloadID = Util.getHashCode(extension + timeframe + observedProperty + clusters);

        this.xmlHttpRequest(
            "GET",
            (EDMS_URL
                + 'edms/get?requestType=getStatus'
                + '&downloadID='
                + downloadID),
            true,
            callback);
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

    xmlHttpRequest = function(type, url, asynchronous, callback) {
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
                    callback();
                }
            }
        }
        xmlHttp.open(type, url, asynchronous);
        xmlHttp.timeout = AppManager.HTTP_REQUEST_TIMEOUT;
        xmlHttp.ontimeout = function() {
            xmlHttp.abort;
            console.error("XMLHttpRequest Timeout >>> " + url);
            callback();
        }
        xmlHttp.onerror = function() {
            xmlHttp.abort;
            console.error("XMLHttpRequest Error >>> " + url);
            callback();
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
        requestGraph,
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