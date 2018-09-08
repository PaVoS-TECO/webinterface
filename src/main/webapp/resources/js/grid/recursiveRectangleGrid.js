define(['grid', 'recursiveRectangleCluster', 'bounds', 'dimension', 'mathUtil'],
function(Grid, RecursiveRectangleCluster, Bounds, Dimension, MathUtil) {
    /**
      * A regular grid, consisting of rectangle clusters with equal size.
      * 
      * @param {*} bounds the bounds the grid should be applied on
      * @param {*} rows the number of rows
      * @param {*} columns the number of columns
      * @param {*} gridLevels the number of gridLevels
      */
    function RecursiveRectangleGrid(bounds, rows, columns, gridLevels) {
        Grid.call(this, bounds, rows, columns, gridLevels);
    }
    RecursiveRectangleGrid.prototype = Object.create(Grid.prototype);
    RecursiveRectangleGrid.prototype.constructor = RecursiveRectangleGrid;

    /**
      * Get the cluster containing the submitted coordinate at the given gridlevel. If the coordiante is
      * out of bounds the cluster closest to it is returned.
      * 
      * @param {*} coordinate the coordinate
      * @param {*} gridLevel the gridlevel
      */
     RecursiveRectangleGrid.prototype.getClusterContainingCoordinate = function(coordinate, gridLevel) {
        // Call this function in superclass
        Grid.prototype.getClusterContainingCoordinate.call(this);

        var rowColumnArray = [];
        for (level = 1; level <= gridLevel; level++) {
            var clusterDimension = this.calculateDimensionAtGridLevel(this.getBounds().getDimension(), this.getRows(), this.getColumns(), level);
            
            var row = MathUtil.mod(Math.floor(this.calculateCoordinateRelativeToBounds(this.getBounds(), coordinate)[0] / clusterDimension.getWidth()), this.getRows());
            var column = MathUtil.mod(Math.floor(this.calculateCoordinateRelativeToBounds(this.getBounds(), coordinate)[1] / clusterDimension.getHeight()), this.getColumns());

            rowColumnArray.push([column, row]);
        }

        return this.createRecursiveRectangleCluster(rowColumnArray);
    };

    /**
      * Get the clusters that are completely or partially contained in the submitted bounds.
      * 
      * @param {*} bounds the bounds
      * @param {*} gridLevel the gridlevel
      */
    RecursiveRectangleGrid.prototype.getClustersContainedInBounds = function(bounds, gridLevel) {
        // Call this function in superclass
        Grid.prototype.getClustersContainedInBounds.call(this);

        var lowerLeftCluster  = this.getClusterContainingCoordinate(this.closestCoordinateInBounds(this.getBounds(), bounds.getLowerLeft()), gridLevel);
        var upperRightCluster = this.getClusterContainingCoordinate(this.closestCoordinateInBounds(this.getBounds(), bounds.getUpperRight()), gridLevel);
        
        var rowMin = 0;
        var columnMin = 0;
        var rowMax = 0;
        var columnMax = 0;
        for (level = 1; level <= gridLevel; level++) {
            rowMin    = rowMin    + (lowerLeftCluster.getRow(level)     * Math.pow(this.getRows(),    (gridLevel - level)));
            columnMin = columnMin + (lowerLeftCluster.getColumn(level)  * Math.pow(this.getColumns(), (gridLevel - level)));
            rowMax    = rowMax    + (upperRightCluster.getRow(level)    * Math.pow(this.getRows(),    (gridLevel - level)));
            columnMax = columnMax + (upperRightCluster.getColumn(level) * Math.pow(this.getColumns(), (gridLevel - level)));
        }

        var clusterArray = [];
        for (rowOffset = 0; rowOffset <= (rowMax - rowMin); rowOffset++) {
            for (columnOffset = 0; columnOffset <= (columnMax - columnMin); columnOffset++) {
                clusterArray.push(new RecursiveRectangleCluster(this.getGridID() + ":" + this.calculateClusterID((rowMin + rowOffset), (columnMin + columnOffset), gridLevel)));
            }
        }
        return clusterArray;
    }

    /**
      * Get the this grids identifier.
      */
    RecursiveRectangleGrid.prototype.getGridID = function() {
        return "recursiveRectangleGrid" + "-" + this.getRows() + "_" + this.getColumns() + "_" + this.getGridLevels();
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
    RecursiveRectangleGrid.prototype.calculateDimensionAtGridLevel = function(dimension, rows, columns, gridLevel) {
        width = (dimension.getWidth()) / Math.pow(rows, gridLevel);
        height = (dimension.getHeight()) / Math.pow(columns, gridLevel);
        return new Dimension(width, height);
    };

    /**
     * Calculate what the coordinates values would be if the bounds lower left corner was the point (0, 0).
     * 
     * @param {*} bounds the bounds
     * @param {*} coordinate the coordinate
     */
    RecursiveRectangleGrid.prototype.calculateCoordinateRelativeToBounds = function(bounds, coordinate) {
        return [(coordinate[0] - bounds.getLowerLeft()[0]), (coordinate[1] - bounds.getLowerLeft()[1])];
    };

    /**
      * Create the recursive rectangle cluster with the given row column array.
      * 
      * @param {*} rowColumnArray the row column array
      */
    RecursiveRectangleGrid.prototype.createRecursiveRectangleCluster = function(rowColumnArray) {
        var clusterID = this.getGridID() + ":";

        for (i = 0; i < rowColumnArray.length; i++) {
            clusterID = clusterID + rowColumnArray[i][0] + "_" + rowColumnArray[i][1];
            if (i < (rowColumnArray.length - 1)) {
                clusterID = clusterID + "-";
            }
        }

        return new RecursiveRectangleCluster(clusterID);
    };

    /**
      * Calculate the cluster id with the given row and column and the submitted grid level.
      * 
      * @param {*} rowOfGridLevel the row of the submitted grid level
      * @param {*} columnOfGridLevel the column of the submitted grid level
      * @param {*} gridLevel the grid level
      */
    RecursiveRectangleGrid.prototype.calculateClusterID = function(rowOfGridLevel, columnOfGridLevel, gridLevel) {
        clusterID = "";

        for (level = 1; level <= gridLevel; level++) {
            if (level < gridLevel) {
                clusterID = clusterID 
                    + MathUtil.mod(Math.floor(rowOfGridLevel / Math.pow(this.getRows(), (gridLevel - level))), this.getRows())
                    + "_" 
                    + MathUtil.mod(Math.floor(columnOfGridLevel / Math.pow(this.getColumns(), (gridLevel - level))), this.getColumns())
                    + "-";
            } else {
                clusterID = clusterID 
                    + (MathUtil.mod(rowOfGridLevel, this.getRows()))
                    + "_" 
                    + (MathUtil.mod(columnOfGridLevel, this.getColumns()));
            }
        }
        return clusterID;
    };

    return RecursiveRectangleGrid;
});