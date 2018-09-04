require.config({
    paths: {
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

        'color': '../resources/js/visualization/color',
        'colorTest': '../tests/unit/visualization/colorTest',
        'colorGradient': '../resources/js/visualization/colorGradient',
        'colorGradientTest': '../tests/unit/visualization/colorGradientTest',
        'multiColorGradient': '../resources/js/visualization/multiColorGradient',
        'multiColorGradientTest': '../tests/unit/visualization/multiColorGradientTest',
       
        'mathUtil': '../resources/js/util/mathUtil',
        'mathUtilTest': '../tests/unit/util/mathUtilTest',
        'parser': '../resources/js/util/parser',
        'parserTest': '../tests/unit/util/parserTest'
    },
    shim: {
        'jasmine-html': {
            deps: ['jasmine']
        },
        'jasmine-boot': {
            deps: ['jasmine', 'jasmine-html']
        }
    }
})

require(['jasmine-boot'], function() {
    require(['boundsTest', 'clusterTest', 'dimensionTest', 'gridTest', 
             'colorTest', 'colorGradientTest', 'multiColorGradientTest', 
             'mathUtilTest', 'parserTest'], 
    function() {
        window.onload();
    })
})