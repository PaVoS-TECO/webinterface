define(['recursiveRectangleGrid', 'cluster', 'mathUtil'], function(RecursiveRectangleGrid, Cluster, MathUtil) {
    buildFromClusterArray = function(grid, clusterArray, timestamp, observationType, valueMin, valueMax) {
        var features = [];
        for (i = 0; i < clusterArray.length; i++) {
            features.push(this.buildFromCluster(grid, clusterArray[i], valueMin, valueMax));
        }
        var result = {
            "type": "FeatureCollection",
            "timestamp": timestamp,
            "observationType": observationType,
            "features": features
        }
        
        return result;
    };

    buildFromCluster = function(grid, cluster, valueMin, valueMax) {
        return {
            "type": "Feature",
            "properties": {
                "clusterID": cluster.getClusterID(),
                "value": MathUtil.randomFloatPseudoNormalDistribution(valueMin, valueMax, 6, 3),
                "content": grid.getSubClusterIDs(cluster)
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    cluster.getCoordinates()
                ]
            }
        }
    };

    return {
        buildFromClusterArray,
        buildFromCluster
    };
})