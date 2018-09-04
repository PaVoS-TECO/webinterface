define(['jquery', 'appManager', 'initializer', 'gridBoundsFetchRoutine', 'gridIDFetchRoutine',
        'exportFormatFetchRoutine', 'sensorTypeFetchRoutine', 'colorGradientFetchRoutine', 'grid', 
        'gridUtil', 'bounds', 'parser'],
function($, AppManager, Initializer, GridBoundsFetchRoutine, GridIDFetchRoutine, ExportFormatFetchRoutine, 
         SensorTypeFetchRoutine, ColorGradientFetchRoutine, Grid, GridUtil, Bounds, Parser) {
    function InitializationRoutine(callback) {
        this.gridBoundsFetched = false;
        this.gridIDFetched = false;
        this.exportFormatFetched = false;
        this.sensorTypeFetched = false;
        this.colorGradientFetched = false;
        this.callback = callback;
    };

    InitializationRoutine.prototype.run = function() {
        console.log("START InitializationRoutine");

        var gridBoundsRoutine = new GridBoundsFetchRoutine(this.gridBoundsFetchNotify.bind(this));
        gridBoundsRoutine.run();
        var exportFormatRoutine  = new ExportFormatFetchRoutine(this.exportFormatFetchNotify.bind(this));
        exportFormatRoutine.run();
        var colorGradientRoutine = new ColorGradientFetchRoutine(this.colorGradientFetchNotify.bind(this));
        colorGradientRoutine.run();
    };

    InitializationRoutine.prototype.gridBoundsFetchNotify = function(gridBounds) {
        if (gridBounds != null) {
            AppManager.MAP_BOUNDS = gridBounds;
        }
        this.gridBoundsFetched = true;

        var gridIDRoutine = new GridIDFetchRoutine(this.gridIDFetchNotify.bind(this));
        gridIDRoutine.run();
    }

    InitializationRoutine.prototype.gridIDFetchNotify = function(gridID) {
        if (gridID != null) {
            AppManager.GRID = GridUtil.parseGridID(AppManager.MAP_BOUNDS, gridID);
        }
        this.gridIDFetched = true;

        var sensorTypeRoutine = new SensorTypeFetchRoutine(AppManager.GRID.getGridID(), this.sensorTypeFetchNotify.bind(this));
        sensorTypeRoutine.run();
    };

    InitializationRoutine.prototype.exportFormatFetchNotify = function(exportFormatArray) {
        AppManager.EXPORTFORMATS_ARRAY = exportFormatArray;
        this.exportFormatFetched = true;

        this.continueIfFinished();
    };

    InitializationRoutine.prototype.sensorTypeFetchNotify = function(sensorTypeArray) {
        AppManager.SENSORTYPES_ARRAY = sensorTypeArray;
        this.sensorTypeFetched = true;
        
        this.continueIfFinished();
    };

    InitializationRoutine.prototype.colorGradientFetchNotify = function(colorGradientJson) {
        AppManager.COLOR_GRADIENTS = Parser.colorGradientRangeJsonToGradientJson(colorGradientJson);
        AppManager.COLOR_GRADIENTS_RANGE = Parser.colorGradientRangeJsonToRangeJson(colorGradientJson);
        this.colorGradientFetched = true;
        
        this.continueIfFinished();
    };

    InitializationRoutine.prototype.continueIfFinished = function() {
        if (this.gridBoundsFetched
            && this.gridIDFetched
            && this.exportFormatFetched
            && this.sensorTypeFetched
            && this.colorGradientFetched) {
                console.log("STOP InitializationRoutine");
                $(document).ready(function() {
                    Initializer.start();
                });
                this.callback();
            }
    };

    return InitializationRoutine;
})