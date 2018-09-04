define(['dimension', 'recursiveRectangleGrid'], function(Dimension, RecursiveRectangleGrid) {
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
     * Parses the submitted grid id and returns its corresponding grid object.
     */
    parseGridID = function(bounds, gridID) {
        gridType = gridID.split('-')[0];
        gridParameters = gridID.split('-')[1].split('_');

        console.log("bounds = " + bounds);

        if (gridType == 'recursiveRectangleGrid') {
            return new RecursiveRectangleGrid(bounds, gridParameters[0], gridParameters[1], gridParameters[2]);
        }
    };
    
    return {
        clusterArrayToStringArray,
        parseGridID,
    };
});