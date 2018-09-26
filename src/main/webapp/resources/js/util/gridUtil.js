define(['bounds', 'dimension', 'mathUtil'], function(Bounds, Dimension, MathUtil) {
    /**
     * Turns an array of clusters into an array of their clusterIDs.
     */
    clusterArrayToStringArray = function(array) {
        var stringArray = [];
        for (i = 0; i < array.length; i++) {
            stringArray.push(array[i].getClusterID());
        }
        return stringArray;
    };

    /**
     * Divides the submitted dimension into equal rectangles using the given rows and columns 
     * per gridlevel and returns the dimension of the resulting object.
     * 
     * @param {*} dimension the dimension
     * @param {*} rows the rows
     * @param {*} columns the columns
     * @param {*} gridLevel the gridLevel
     */
    calculateDimensionAtGridLevel = function(dimension, rows, columns, gridLevel) {
        width = (dimension.getWidth()) / Math.pow(columns, gridLevel);
        height = (dimension.getHeight()) / Math.pow(rows, gridLevel);
        return new Dimension(width, height);
    };

    /**
     * Calculate what the coordinates values would be if the bounds lower left corner was the point (0, 0).
     * 
     * @param {*} bounds the bounds
     * @param {*} coordinate the coordinate
     */
    calculateCoordinateRelativeToBounds = function(bounds, coordinate) {
        return [(coordinate[0] - bounds.getLowerLeft()[0]), (coordinate[1] - bounds.getLowerLeft()[1])];
    };

    /**
      * Create the recursive rectangle cluster with the given row column array.
      * 
      * @param {*} gridID the grid identifier
      * @param {*} rowColumnArray the row column array
      */
    createRecursiveRectangleClusterIDFromArray = function(gridID, rowColumnArray) {
        var clusterID = gridID + ":";

        for (i = 0; i < rowColumnArray.length; i++) {
            clusterID = clusterID + rowColumnArray[i][0] + "_" + rowColumnArray[i][1];
            if (i < (rowColumnArray.length - 1)) {
                clusterID = clusterID + "-";
            }
        }

        return clusterID;
    };

    /**
      * Calculate the cluster id with the given total row and total column and the submitted grid level.
      * 
      * @param {*} gridID the grid identifier
      * @param {*} rows the amount of rows in each cluster
      * @param {*} columns the amount of columns in each cluster
      * @param {*} rowOfGridLevel the row of the submitted grid level
      * @param {*} columnOfGridLevel the column of the submitted grid level
      * @param {*} gridLevel the grid level
      */
    createRecursiveRectangleClusterID = function(gridID, rows, columns, rowOfGridLevel, columnOfGridLevel, gridLevel) {
        clusterID = gridID + ":";

        for (level = 1; level <= gridLevel; level++) {
            if (level < gridLevel) {
                clusterID = clusterID 
                    + MathUtil.mod(Math.floor(rowOfGridLevel / Math.pow(rows, (gridLevel - level))), rows)
                    + "_" 
                    + MathUtil.mod(Math.floor(columnOfGridLevel / Math.pow(columns, (gridLevel - level))), columns)
                    + "-";
            } else {
                clusterID = clusterID 
                    + (MathUtil.mod(rowOfGridLevel, rows))
                    + "_" 
                    + (MathUtil.mod(columnOfGridLevel, columns));
            }
        }
        return clusterID;
    };

    /**
      * Calculate the corner coordinates for the submitted cluster identifier.
      * 
      * @param {*} gridBounds the bounds of the grid
      * @param {*} dimensionAtGridLevel the dimension of a cluster in each grid level
      * @param {*} clusterID the cluster id
      */
    calculateRecursiveRectangleClusterCoordinates = function(gridBounds, clusterID) {
        var gridParams = clusterID.split(":")[0].split("-")[1].split("_");
        var rows = gridParams[0];
        var columns = gridParams[1];
        
        // gridID:1_1-2_2 -> [[1, 1], [2, 2]]
        var rowColumnArray = [];
        clusterID.split(":")[1].split("-").forEach(function(element) {
            rowColumnArray.push(element.split("_"));
        });

        var dimensionAtGridLevel = [];
        for (gridLevel = 1; gridLevel <= rowColumnArray.length; gridLevel++) {
            dimensionAtGridLevel.push(this.calculateDimensionAtGridLevel(gridBounds.getDimension(), rows, columns, gridLevel));
        }

        var lowerLeft = gridBounds.getLowerLeft();
        var width;
        var height;
        for (gridLevel = 1; gridLevel <= rowColumnArray.length; gridLevel++) {
            width = dimensionAtGridLevel[(gridLevel - 1)].getWidth();
            height = dimensionAtGridLevel[(gridLevel - 1)].getHeight();
            lowerLeft = 
                [
                    (lowerLeft[0] + (rowColumnArray[gridLevel - 1][1] * width)), 
                    (lowerLeft[1] + (rowColumnArray[gridLevel - 1][0] * height))
                ];
        }

        var coordinates = [];
        coordinates.push([lowerLeft[0], lowerLeft[1]]);
        coordinates.push([(lowerLeft[0] + width), lowerLeft[1]]);
        coordinates.push([(lowerLeft[0] + width), (lowerLeft[1] + height)]);
        coordinates.push([lowerLeft[0], (lowerLeft[1] + height)]);

        return coordinates;
    };

    toggleClusterInClusterArray = function(clusterArray, cluster) {
        var identifierArray = this.clusterArrayToStringArray(clusterArray);
        var identifier = cluster.getClusterID();

        var index = -1;
        for (i = 0; i < identifierArray.length; i++) {
            if (identifier == identifierArray[i]) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            clusterArray.splice(index, 1);
        } else {
            clusterArray.push(cluster);
        }
    }

    toggleClusterInNestedArray = function(array, cluster) {
        var identifier = cluster.getClusterID();
        var index = -1;
        for (i = 0; i < array.length; i++) {
            if (identifier == array[i][0]) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            array.splice(index, 1);
        } else {
            array.push([cluster.getClusterID()]);
        }
    }
    
    return {
        clusterArrayToStringArray,
        calculateDimensionAtGridLevel,
        calculateCoordinateRelativeToBounds,
        createRecursiveRectangleClusterIDFromArray,
        createRecursiveRectangleClusterID,
        calculateRecursiveRectangleClusterCoordinates,
        toggleClusterInClusterArray,
        toggleClusterInNestedArray
    };
});