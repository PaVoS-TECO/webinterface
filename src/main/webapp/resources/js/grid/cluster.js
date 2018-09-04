define(function() {
    /**
      * Clusters are what make up a Grid. Each Cluster has a unique identifier. 
      * 
      * @param {*} clusterID the cluster identifier
      */
    function Cluster(clusterID) {
        this.clusterID = clusterID;
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

    return Cluster;
});