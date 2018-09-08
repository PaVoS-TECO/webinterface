require.config({
    paths: {
        'jquery': '../vendors/jquery/3.3.1/jquery.min',
        'leaflet': '../vendors/leaflet/leaflet',
        'jasmine': '../vendors/jasmine/lib/jasmine-3.2.1/jasmine',
        'jasmine-html': '../vendors/jasmine/lib/jasmine-3.2.1/jasmine-html',
        'jasmine-boot': '../vendors/jasmine/lib/jasmine-3.2.1/boot',

        'bounds': '../resources/js/grid/bounds',
        'boundsTest': '../tests/unit/grid/boundsTest',
        'cluster': '../resources/js/grid/cluster',
        'clusterTest': '../tests/unit/grid/clusterTest',
        'dimension': '../resources/js/grid/dimension',
        'dimensionTest': '../tests/unit/grid/dimensionTest',
        'grid': '../resources/js/grid/grid',
        'gridTest': '../tests/unit/grid/gridTest',
        'recursiveRectangleCluster': '../resources/js/grid/recursiveRectangleCluster',
        'recursiveRectangleClusterTest': '../tests/unit/grid/recursiveRectangleClusterTest',
        'recursiveRectangleGrid': '../resources/js/grid/recursiveRectangleGrid',
        'recursiveRectangleGridTest': '../tests/unit/grid/recursiveRectangleGridTest',
        
        'color': '../resources/js/visualization/color',
        'colorTest': '../tests/unit/visualization/colorTest',
        'colorGradient': '../resources/js/visualization/colorGradient',
        'colorGradientTest': '../tests/unit/visualization/colorGradientTest',
        'multiColorGradient': '../resources/js/visualization/multiColorGradient',
        'multiColorGradientTest': '../tests/unit/visualization/multiColorGradientTest',
       
        'dateTime': '../resources/js/util/dateTime',
        'dateTimeTest': '../tests/unit/util/dateTimeTest',
        'dynamicHtmlBuilder': '../resources/js/util/dynamicHtmlBuilder',
        'dynamicHtmlBuilderTest': '../tests/unit/util/dynamicHtmlBuilderTest',
        'gridUtil': '../resources/js/util/gridUtil',
        'gridUtilTest': '../tests/unit/util/gridUtilTest',
        'leafletMapDemo': '../resources/js/util/leafletMapDemo',
        'leafletMapDemoTest': '../tests/unit/util/leafletMapDemoTest',
        'leafletUtil': '../resources/js/util/leafletUtil',
        'leafletUtilTest': '../tests/unit/util/leafletUtilTest',
        'mathUtil': '../resources/js/util/mathUtil',
        'mathUtilTest': '../tests/unit/util/mathUtilTest',
        'parser': '../resources/js/util/parser',
        'parserTest': '../tests/unit/util/parserTest',
        'storageUtil': '../resources/js/util/storageUtil',
        'storageUtilTest': '../tests/unit/util/storageUtilTest',
        'utcDateTime': '../resources/js/util/utcDateTime',
        'utcDateTimeTest': '../tests/unit/util/utcDateTimeTest',
        'util': '../resources/js/util/util',
        'utilTest': '../tests/unit/util/utilTest'
    },
    shim: {
        'leaflet': {
            'exports': 'L'
        },
        'jasmine-html': {
            deps: ['jasmine']
        },
        'jasmine-boot': {
            deps: ['jasmine', 'jasmine-html']
        }
    }
})

require(['jasmine-boot'], function() {
    require(['boundsTest', 'clusterTest', 'dimensionTest', 'gridTest', 'recursiveRectangleClusterTest', 'recursiveRectangleGridTest', 
             'colorTest', 'colorGradientTest', 'multiColorGradientTest', 
             'dateTimeTest', 'dynamicHtmlBuilderTest', 'gridUtilTest', 'leafletMapDemoTest', 'leafletUtilTest', 'mathUtilTest', 'parserTest', 'storageUtilTest', 'utcDateTimeTest', 'utilTest'], 
    function() {
        window.onload();
    })
})