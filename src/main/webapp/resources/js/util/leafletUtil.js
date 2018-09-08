define(['bounds', 'util', 'mathUtil', 'leaflet'], function(Bounds, Util, MathUtil) {
    var columnsPer = 10;
    var rowsPer = 10;
    var gridLevel = 1;
    var gridLayerGroup;

    return {
        /**
         * Draw a point on the submitted leaflet map at the given coordinate and with the given style.
         * 
         * @param {*} map the leaflet map
         * @param {*} coordinate the coordinate
         * @param {*} style the defined style
         */
        drawPoint: function(map, coordinate, style) {
            var point = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": this.switchLatLon(coordinate)
                }
            };

            return L.geoJSON(point, {
                style: style
            }).addTo(map);
        },

        /**
         * Draw a line on the submitted leaflet map at the given coordinates and with the given style.
         * 
         * @param {*} map the leaflet map
         * @param {*} coordinates the coordinates
         * @param {*} style the defined style
         */
        drawLine: function(map, coordinates, style) {
            var line = [{
                "type": "LineString",
                "coordinates": this.switchLatLonForEach(coordinates)
            }];

            return L.geoJSON(line, {
                style: style
            }).addTo(map);
        },

        /**
         * Draw a polygon on the submitted leaflet map at the given coordinates and with the given style.
         * 
         * @param {*} map the leaflet map
         * @param {*} coordinates the coordinates
         * @param {*} style the defined style
         */
        drawPolygon: function(map, coordinates, style) {
            var polygon = {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [this.switchLatLonForEach(coordinates)]
                }
            };

            return L.geoJSON(polygon, {
                style: style
            }).addTo(map);
        },

        /**
          * Returns a layer containing the geojson with the onEachFeature function applied to each feature.
          * 
          * @param {*} map the map
          * @param {*} geoJson the geojson
          * @param {*} onEachFeature the function that should be applied on each feature
          */
        createLayerFromGeoJson: function(geoJson, onEachFeature) {
            return L.geoJSON(geoJson, {
                onEachFeature: onEachFeature
            })
        },

        /**
         * Displays the submitted GeoJson on the leaflet map.
         * 
         * @param {*} map the leaflet map
         * @param {*} geoJson the submitted geoJson
         * @param {*} style the defined style
         */
        displayGeoJSONWithStyle: function(map, geoJson, style) {
            L.geoJSON(geoJson, {
                style: style,
                onEachFeature: this.bindPopupContent
            }).addTo(map);
        },

        /**
         * Returns the submitted coordinate with switched latitude and longitude.
         * 
         * @param {*} coordinates the submitted coordinate
         */
        switchLatLon: function(coordinate) {
            return [coordinate[1], coordinate[0], coordinate[2]];
        },
        
        /**
         * Returns the submitted coordinates with switched latitude and longitude.
         * 
         * @param {*} coordinates the submitted coordinates
         */
        switchLatLonForEach: function(coordinates) {
            var formattedCoordinates = [];
            var LeafletUtil = this;
            coordinates.forEach(function(element) {
                formattedCoordinates.push(LeafletUtil.switchLatLon(element));
            });
            return formattedCoordinates;
        },

        /**
         * Returns the style of a leaflet layer by calculating its color 
         * using the submitted color gradient, a range and a value.
         * 
         * @param {*} min the min value
         * @param {*} max the max value
         * @param {*} value the value
         * @param {*} colorGradient the color gradient
         * @param {*} fillOp the fill opacity
         * @param {*} borderOp the border opacity
         * @param {*} borderWeight the border weight
         */
        getStyle: function(min, max, value, colorGradient, fillOp, borderOp, borderWeight) {
            var fillCol = '#ffffff';
            var fillOpac = 0;
            var borderColor = '#ffffff';
            var borderOpacity = 0;

            if (!isNaN(value)
                && (value != null)) {

                var fillCol = colorGradient.getColor(min, max, value).getHex();
                var fillOpac = fillOp;
                var borderColor = colorGradient.getColor(min, max, value).getHex();
                var borderOpacity = borderOp;

            }

            return {
                fillColor: fillCol,
                fillOpacity: fillOpac,
                color: borderColor,
                opcaity: borderOpacity,
                weight: borderWeight
            }
        },

        /*
        * Initiate a leaflet map.
        */
       createLeafletMap: function(container, baseMapURL, baseMapAttributes, mapBounds, coordinates, zoomLevel, fullscreenAvailable, mouseCoordinatesVisible) {

            var map = new L.Map(container, {
                fullscreenControl: fullscreenAvailable,
                fullscreenControlOptions: {
                    position: 'topleft'
                }
            });

            map.setMaxBounds(mapBounds.toLeafletMapBounds());
        
            if (mouseCoordinatesVisible) {
                L.control.coordinates({
                    position:"topright",
                    enableUserInput: false,
                    useLatLngOrder: true,
                    markerType: L.Icon, //optional default L.marker
                    markerProps: {}, //optional default {},
                }).addTo(map);
            }
            
            this.addBaseMap(map, baseMapURL, baseMapAttributes, coordinates, zoomLevel);
        
            return map;
        },

        /**
         * Add a base map to the submitted leaflet map at the given coordinates and with the given zoom level.
         * 
         * @param {*} map the leaflet map
         * @param {*} baseMapURL the URL of the base map
         * @param {*} baseMapAttributes the attributes of the base map
         * @param {*} coordinates the initial coordinates
         * @param {*} zoomLevel the initial zoom level
         */
        addBaseMap: function(map, baseMapURL, baseMapAttributes, coordinates, zoomLevel) {
            var baseMap = new L.tileLayer(baseMapURL, baseMapAttributes);

            map.setView(coordinates, zoomLevel).addLayer(baseMap);
        },

        initializeLeafletMap: function(map, onMoveEnd) {
            map.on("zoomend", function() {
                onMoveEnd();
            });

            map.on("dragend", function() {
                onMoveEnd();
            });
        }
    }
});