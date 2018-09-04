define(function() {
    initializeGridDemo = function(map) {
        gridLayerGroup = this.createRectangleGrid(map.getBounds(), this.calculateGridLevel(map.getZoom()), columnsPer, rowsPer);
        gridLayerGroup.addTo(map);

        // Used to access local scope
        var LeafletUtil = this;
        map.on("moveend", function () {
            LeafletUtil.updateRectangleGrid(map);
        });
        map.on('zoomend', function(e) {
            LeafletUtil.handleZoom(map);
        });
    };

    createRectangleGrid = function(bounds, currentGridLevel, columnsPerCluster, rowsPerCluster) {
        // The grid
        var grid = L.layerGroup();

        // The starting coordinate of the map (latitude = -90 and longitude = -180)
        var latitudeStart = -90;
        var longitudeStart = -180;

        // The possible range of the map (latitude = 180 and longitude = 360 by default)
        var latitudeRange = 180;
        var longitudeRange = 360;

        // The size of each cluster at the given grid level
        var clusterSizeLatitude = Math.abs(this.splitRange(latitudeRange, columnsPerCluster, currentGridLevel));
        var clusterSizeLongitude = Math.abs(this.splitRange(longitudeRange, rowsPerCluster, currentGridLevel));

        // Extract the latitude and longitude values of the currently regarded bounds
        var minLatitude = bounds.getSouthWest().lat;
        var minLongitude = bounds.getSouthWest().lng;
        var maxLatitude = bounds.getNorthEast().lat;
        var maxLongitude = bounds.getNorthEast().lng;

        // Calculate the cluster rows and columns that have to be displayed to fully overlap submitted bounds
        var minClusterColumn = Math.floor(minLatitude / clusterSizeLatitude) + (Math.pow(columnsPer, currentGridLevel) / 2);
        var minClusterRow = Math.floor(minLongitude / clusterSizeLongitude) + (Math.pow(rowsPer, currentGridLevel) / 2);
        var maxClusterColumn = Math.floor(maxLatitude / clusterSizeLatitude) + 1 + (Math.pow(columnsPer, currentGridLevel) / 2);
        var maxClusterRow = Math.floor(maxLongitude / clusterSizeLongitude) + 1 + (Math.pow(rowsPer, currentGridLevel) / 2);

        for (column = minClusterColumn; column <= maxClusterColumn; column++) {
            for (row = minClusterRow; row <= maxClusterRow; row++) {
                // color = (function(m,s,c){return (c ? arguments.callee(m,s,c-1) : '#') + s[m.floor(m.random() * s.length)]})(Math,'0123456789ABCDEF',5);
                var color = Util.rgbToHex(Util.getRandomInt(75, 200), Util.getRandomInt(175, 255), Util.getRandomInt(0, 75));
                var weight  = 0.25;
                
                var clusterLatitude = latitudeStart + (column * clusterSizeLatitude);
                var clusterLongitude = longitudeStart + (row * clusterSizeLongitude);

                var clusterBounds = [[clusterLatitude, clusterLongitude], [clusterLatitude + clusterSizeLatitude, clusterLongitude + clusterSizeLongitude]];
                // L.rectangle(clusterBounds, {color: color, weight: weight}).bindPopup(MathUtil.mod(row, rowsPer) + "-" + MathUtil.mod(column, columnsPer)).addTo(grid);
                L.rectangle(clusterBounds, {color: color, weight: weight}).bindPopup(MathUtil.mod(column, columnsPer) + "-" + MathUtil.mod(row, rowsPer)).addTo(grid);
            }
        }

        return grid;
    };

    updateRectangleGrid = function(map) {
        this.resetRectangleGrid(map);
        gridLayerGroup = this.createRectangleGrid(map.getBounds(), this.calculateGridLevel(map.getZoom()), columnsPer, rowsPer);
        gridLayerGroup.addTo(map);
    };

    resetRectangleGrid = function(map) {
        map.removeLayer(gridLayerGroup);
    };

    handleZoom = function(map) {
        var newGridLevel = this.calculateGridLevel(map.getZoom());

        if (gridLevel != newGridLevel) {
            gridLevel = newGridLevel;

            this.updateRectangleGrid(map);
        }
    };

    calculateGridLevel = function(zoom) {
        array = [4, 7, 10, 13, 17];

        var tempGridLevel = 0;
        for (index = 0; index < array.length; index++) {
            tempGridLevel++;
            if (zoom <= array[index]) {
                return tempGridLevel;
            }
        }
        return tempGridLevel;
    };

    splitRange = function(range, objectsPerCluster, gridLevel) {
        return (range / Math.pow(objectsPerCluster, gridLevel));
    };

    bindPopupContent = function(feature, layer) {
        if (feature.properties && feature.properties.popupContent) {
            layer.bindPopup(feature.properties.popupContent);
        } else {
            layer.bindPopup("");
        }
    };

    return {
        initializeGridDemo
    };
});