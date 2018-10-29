define(['jquery', 'appManager', 'initializer', 'gridBoundsFetchRoutine', 'gridIDFetchRoutine',
        'exportFormatFetchRoutine', 'sensorTypeFetchRoutine', 'colorGradientFetchRoutine', 'grid', 
        'bounds', 'parser'],
function($, AppManager, Initializer, GridBoundsFetchRoutine, GridIDFetchRoutine, ExportFormatFetchRoutine, 
         SensorTypeFetchRoutine, ColorGradientFetchRoutine, Grid, Bounds, Parser) {
    function InitializationRoutine() {
        this.gridBoundsFetched = false;
        this.gridIDFetched = false;
        this.exportFormatFetched = false;
        this.sensorTypeFetched = false;
        this.colorGradientFetched = false;
    };

    InitializationRoutine.prototype.run = function() {
        console.log("START InitializationRoutine");

        // Initializer.start();
        // this.callback();

        var gridBoundsRoutine = new GridBoundsFetchRoutine(this.gridBoundsFetchCallback.bind(this));
        gridBoundsRoutine.run();
        var exportFormatRoutine  = new ExportFormatFetchRoutine(this.exportFormatFetchCallback.bind(this));
        exportFormatRoutine.run();
        var colorGradientRoutine = new ColorGradientFetchRoutine(this.colorGradientFetchCallback.bind(this));
        colorGradientRoutine.run();
    };

    InitializationRoutine.prototype.gridBoundsFetchCallback = function(gridBounds) {
        if (gridBounds != null) {
            AppManager.MAP_BOUNDS = gridBounds;
        }
        this.gridBoundsFetched = true;

        var gridIDRoutine = new GridIDFetchRoutine(this.gridIDFetchCallback.bind(this));
        gridIDRoutine.run();
    }

    InitializationRoutine.prototype.gridIDFetchCallback = function(gridID) {
        if (gridID != null) {
            AppManager.GRID = Parser.parseGridID(AppManager.MAP_BOUNDS, gridID);
        }
        this.gridIDFetched = true;

        var sensorTypeRoutine = new SensorTypeFetchRoutine(
            AppManager.GRID.getGridID(), 
            this.sensorTypeFetchCallback.bind(this)
        );
        sensorTypeRoutine.run();
    };

    InitializationRoutine.prototype.exportFormatFetchCallback = function(exportFormatArray) {
        AppManager.EXPORTFORMATS_ARRAY = exportFormatArray;
        this.exportFormatFetched = true;

        this.continueIfFinished();
    };

    InitializationRoutine.prototype.sensorTypeFetchCallback = function(sensorTypeArray) {
        AppManager.SENSORTYPES_ARRAY = sensorTypeArray;
        this.sensorTypeFetched = true;
        
        this.continueIfFinished();
    };

    InitializationRoutine.prototype.colorGradientFetchCallback = function(colorGradientJson) {
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
            var _this = this;
            $(document).ready(function() {
                Initializer.start();
            });
        }
    };

    return InitializationRoutine;
})