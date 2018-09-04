define(['initializationRoutine', 'fetchRoutine', 'exportRoutine', 'recursiveRectangleCluster', 'utcDateTime'], 
function(InitializationRoutine, FetchRoutine, ExportRoutine, RecursiveRectangleCluster, UTCDateTime) {
    function App() { }

    App.prototype.run = function() {
        initRoutine = new InitializationRoutine(FetchRoutine.run);
        initRoutine.run();
        // var cluster = new RecursiveRectangleCluster('recursiveRectangleGrid-2_2_3:1_0');
        
        // var exportRoutine = new ExportRoutine(25000, 1000, 'csv', [new UTCDateTime(2018, 7, 1, 0, 0, 0), new UTCDateTime(2018, 9, 30, 0, 0, 0)], ['Temperature'], [cluster]);
        // exportRoutine.run();
    }

    return App;
});