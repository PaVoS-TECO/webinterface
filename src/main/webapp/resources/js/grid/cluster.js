define(function() {
    /**
      * Clusters are what make up a Grid. Each Cluster has a unique identifier and an array of coordinates
      * that describe the shape it covers. 
      * 
      * @param {*} clusterID the cluster identifier
      * @param {*} coordinates the coordinates of the shape that the cluster covers
      */
    function Cluster(clusterID, coordinates) {
        this.clusterID = clusterID;
        this.coordinates = coordinates;
    }

    /**
      * Set the cluster identifier.
      * 
      * @param {*} clusterID the cluster identifier
      */
    Cluster.prototype.setClusterID = function(clusterID) {
        this.clusterID = clusterID;
    }
    /**
      * Get the cluster identifier.
      */
    Cluster.prototype.getClusterID = function() {
        return this.clusterID;
    }
    /**
      * Set the corner coordinates of the shape this cluster is made out of
      * 
      * @param {*} coordinates an array of points
      */
    Cluster.prototype.setCoordinates = function(coordinates) {
        this.coordinates = coordinates;
    }
    /**
      * Get the corner coordinates of the shape this cluster is made out of
      */
    Cluster.prototype.getCoordinates = function() {
        return this.coordinates;
    }

    return Cluster;
});