define(['requestor', 'util'], function(Requestor, Util) {
    function ExportRoutine(stopRoutineAfter, repeatStatusRequestAfter, extension, timeframe, observedProperties, clusters) {
        this.routineTimeout = null;
        this.stopRoutineAfter = stopRoutineAfter;
        this.statusRequestTimeout = null;
        this.repeatStatusRequestAfter = repeatStatusRequestAfter;

        this.extension = extension;
        this.timeframe = timeframe;
        this.observedProperties = observedProperties;
        this.clusters = clusters;
    };

    ExportRoutine.prototype.run = function() {
        this.routineTimeout = setTimeout(function() {
            throw new Error("Export timeout after " + this.stopRoutineAfter + " ms");
        }, this.stopRoutineAfter);

        Requestor.requestExport(
            this.extension,  
            this.timeframe,
            this.observedProperties, 
            this.clusters, 
            this.handleExportRequest.bind(this),
            this.handleExportRequestError.bind(this)
        );
    };

    ExportRoutine.prototype.handleExportRequest = function(response) {
        if ((Util.replaceAll(response, '\n', '') == 'started')
            || (Util.replaceAll(response, '\n', '') == 'duplicate')) {
            Requestor.requestExportStatus(
                this.extension,
                this.timeframe, 
                this.observedProperties, 
                this.clusters, 
                this.handleExportStatusRequest.bind(this),
                this.handleExportStatusRequestError.bind(this)
            );
        } else {
            this.handleExportRequestError();
        }
    };

    ExportRoutine.prototype.handleExportRequestError = function() {
        clearTimeout(this.routineTimeout);
        console.error(
            "Export for exportformat '"
            + this.extension
            + "', timeframe '"
            + this.timeframe
            + "', sensortype '"
            + this.observedProperties 
            + "' and cluster identifier(s) '"
            + this.clusters
            + "' couldn't be requested"
        );
        Requestor.stopLoadAnimation();
    };

    ExportRoutine.prototype.handleExportStatusRequest = function(response) {
        if (Util.replaceAll(response, '\n', '') == 'true') {
            clearTimeout(this.routineTimeout);
            Requestor.requestDownload(
                this.extension,
                this.timeframe,
                this.observedProperties,
                this.clusters
            );
        } else if (Util.replaceAll(response, '\n', '') == 'false') {
            var _this = this;
            this.statusRequestTimeout = setTimeout(function() {
                Requestor.requestExportStatus(
                    _this.extension,
                    _this.timeframe,
                    _this.observedProperties, 
                    _this.clusters,
                    _this.handleExportStatusRequest.bind(_this),
                    _this.handleExportStatusRequestError.bind(_this)
                );
            }, this.repeatStatusRequestAfter);
        } else if (Util.replaceAll(response, '\n', '') == 'noID') {
            clearTimeout(this.routineTimeout);
            throw new Error("No export with the given parameters has been requested yet");
        } else if (Util.replaceAll(response, '\n', '') == 'error') {
            clearTimeout(this.routineTimeout);
            throw new Error("An error occured while the export was in progress");
        } else {
            clearTimeout(this.routineTimeout);
            throw new Error("Invalid response");
        }
    };

    ExportRoutine.prototype.handleExportStatusRequestError = function() {
        clearTimeout(this.routineTimeout);
        console.error(
            "Export Status for exportformat '"
            + this.extension
            + "', timeframe '"
            + this.timeframe
            + "', sensortype '"
            + this.observedProperties 
            + "' and cluster identifier(s) '"
            + this.clusters
            + "' couldn't be requested"
        );
    }

    return ExportRoutine;
})