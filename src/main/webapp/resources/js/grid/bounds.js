define(['dimension', 'leaflet'], function(Dimension) {
    /**
      * Encapsulates two points and provides the corner coordinates and the dimension 
      * of the rectangle they create.
      * 
      * @param {*} point1 the first point
      * @param {*} point2 the second point
      */
    function Bounds(point1, point2) {
        if (((point1 != null) && (point1 != undefined))
            && ((point2 != null) && (point2 != undefined))) {
            var x1 = Number(point1[0]);
            var y1 = Number(point1[1]);
            var x2 = Number(point2[0]);
            var y2 = Number(point2[1]);

            this.minX = Math.min(x1, x2);
            this.maxX = Math.max(x1, x2);
            this.minY = Math.min(y1, y2);
            this.maxY = Math.max(y1, y2);
        }
    }

    /**
      * Get the minimal x value of this bounds.
      */
    Bounds.prototype.getMinX = function() {
        return this.minX;
    }
    /**
      * Get the maximal x value of this bounds.
      */
    Bounds.prototype.getMaxX = function() {
        return this.maxX;
    }
    /**
      * Get the minimal y value of this bounds.
      */
    Bounds.prototype.getMinY = function() {
        return this.minY;
    }
    /**
      * Get the maximal y value of this bounds.
      */
    Bounds.prototype.getMaxY = function() {
        return this.maxY;
    }

    /**
      * Get the coordinates of the lower left corner.
      */
    Bounds.prototype.getLowerLeft = function() {
        return [this.minX, this.minY];
    }
    /**
      * Get the coordinates of the upper left corner.
      */
    Bounds.prototype.getUpperLeft = function() {
        return [this.minX, this.maxY];
    }
    /**
      * Get the coordinates of the lower right corner.
      */
    Bounds.prototype.getLowerRight = function() {
        return [this.maxX, this.minY];
    }
    /**
      * Get the coordinates of the upper right corner.
      */
    Bounds.prototype.getUpperRight = function() {
        return [this.maxX, this.maxY];
    }

    /**
      * Returns whether the submitted coordinate is contained in these Bounds or not.
      * 
      * @param {*} coordinate the coordinate
      */
    Bounds.prototype.contains = function(coordinate) {
        if ((coordinate[0][0] < this.minX)
            && (coordinate[0][0] > this.maxX)
            && (coordinate[0][1] < this.minY)
            && (coordinate[0][1] > this.maxY)
            && (coordinate[1][0] < this.minX)
            && (coordinate[1][0] > this.maxX)
            && (coordinate[1][1] < this.minY)
            && (coordinate[1][1] > this.minY)) {

            return true;

        } else {

            return false;

        }
    }

    /**
      * Get the dimension.
      */
    Bounds.prototype.getDimension = function() {
        return new Dimension((this.maxX - this.minX), (this.maxY - this.minY));
    }

    /**
      * Parses and sets this bounds instance to the submitted leaflet bounds.
      * 
      * @param {*} bounds the leaflet map bounds
      */
    Bounds.prototype.parseLeafletMapBounds = function(bounds) {
        this.minX = bounds.getSouthWest().lng;
        this.minY = bounds.getSouthWest().lat;
        this.maxX = bounds.getNorthEast().lng;
        this.maxY = bounds.getNorthEast().lat;
    }

    /**
      * Returns these bounds formatted for leaflet.
      */
    Bounds.prototype.toLeafletMapBounds = function() {
        var southWest = L.latLng(this.getLowerLeft()[1], this.getLowerLeft()[0]);
        var northEast = L.latLng(this.getUpperRight()[1], this.getUpperRight()[0]);
        return L.latLngBounds(southWest, northEast);
    }

    return Bounds;
});