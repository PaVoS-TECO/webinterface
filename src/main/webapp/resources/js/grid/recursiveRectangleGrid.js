define(['grid', 'recursiveRectangleCluster', 'bounds', 'dimension', 'gridUtil', 'mathUtil'],
function(Grid, RecursiveRectangleCluster, Bounds, Dimension, GridUtil, MathUtil) {
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
            var clusterDimension = GridUtil.calculateDimensionAtGridLevel(this.getBounds().getDimension(), this.getRows(), this.getColumns(), level);
            
            var row = MathUtil.mod(
                Math.floor(
                    GridUtil.calculateCoordinateRelativeToBounds(
                        this.getBounds(), 
                        coordinate
                    )[1] / clusterDimension.getHeight()
                ), 
                this.getRows()
            );
            var column = MathUtil.mod(
                Math.floor(
                    GridUtil.calculateCoordinateRelativeToBounds(
                        this.getBounds(), 
                        coordinate
                    )[0] / clusterDimension.getWidth()
                ), 
                this.getColumns()
            );
            
            rowColumnArray.push([row, column]);
        }

        var clusterID = GridUtil.createRecursiveRectangleClusterIDFromArray(
            this.getGridID(), 
            rowColumnArray
        );
        
        return new RecursiveRectangleCluster(
            clusterID,
            GridUtil.calculateRecursiveRectangleClusterCoordinates(
                this.getBounds(), 
                clusterID
            )
        );  
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
                var clusterID = GridUtil.createRecursiveRectangleClusterID(
                    this.getGridID(), 
                    this.getRows(), 
                    this.getColumns(), 
                    (rowMin + rowOffset), 
                    (columnMin + columnOffset), 
                    gridLevel
                );
                
                clusterArray.push(
                    new RecursiveRectangleCluster(
                        clusterID,
                        GridUtil.calculateRecursiveRectangleClusterCoordinates(
                            this.getBounds(), 
                            clusterID
                        )
                    )
                );
            }
        }
        return clusterArray;
    }

    RecursiveRectangleGrid.prototype.getSubClusterIDs = function(cluster) {
        // Call this function in superclass
        Grid.prototype.getSubClusterIDs.call(this);

        var subClusterIDs = [];
        for (row = 0; row < this.getRows(); row++) {
            for (column = 0; column < this.getColumns(); column++) {
                subClusterIDs.push(
                    cluster.getClusterID() 
                    + "-" 
                    + row 
                    + "_" 
                    + column
                );
            }
        }
        return subClusterIDs;
    };

    /**
      * Get the this grids identifier.
      */
    RecursiveRectangleGrid.prototype.getGridID = function() {
        return "recursiveRectangleGrid" + "-" + this.getRows() + "_" + this.getColumns() + "_" + this.getGridLevels();
    };

    /**
      * Returns whether the submitted is a valid cluster identifier
      * 
      * @param {*} input the input
      */
    RecursiveRectangleGrid.prototype.isValidClusterID = function(input) {
        var regex = new RegExp(
            this.getGridID()
            + ":"
              + "[0-" + (this.getRows() - 1) + "]" + "_" + "[0-" + (this.getColumns() - 1) + "]"
            + "("
              + "-[0-" + (this.getRows() - 1) + "]" + "_" + "[0-" + (this.getColumns() - 1) + "]"
            + ")"
            + "{0," +  (this.getGridLevels() - 1) + "}"
        );
        
        var match = input.match(regex);
        if ((match != null) && (match[0] == input)) {
            return true;
        } else {
            return false;
        }
    }

    return RecursiveRectangleGrid;
});