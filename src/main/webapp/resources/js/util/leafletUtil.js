define(['bounds', 'util', 'mathUtil', 'leaflet'], function(Bounds, Util, MathUtil) {
    var columnsPer = 10;
    var rowsPer = 10;
    var gridLevel = 1;
    var gridLayerGroup;

    /**
     * Draw a point on the submitted leaflet map at the given coordinate and with the given style.
     * 
     * @param {*} map the leaflet map
     * @param {*} coordinate the coordinate
     * @param {*} style the defined style
     */
    drawPoint = function(map, coordinate, style) {
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
    };

    /**
     * Draw a line on the submitted leaflet map at the given coordinates and with the given style.
     * 
     * @param {*} map the leaflet map
     * @param {*} coordinates the coordinates
     * @param {*} style the defined style
     */
    drawLine = function(map, coordinates, style) {
        var line = [{
            "type": "LineString",
            "coordinates": this.switchLatLonForEach(coordinates)
        }];

        return L.geoJSON(line, {
            style: style
        }).addTo(map);
    };

    /**
     * Draw a polygon on the submitted leaflet map at the given coordinates and with the given style.
     * 
     * @param {*} map the leaflet map
     * @param {*} coordinates the coordinates
     * @param {*} style the defined style
     */
    drawPolygon = function(map, coordinates, style) {
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
    };

    createLayer = function() {
        return new L.FeatureGroup();
    };

    resetLayer = function(layer) {
        for (var id in layer._layers) {
            layer.removeLayer(id);
        }
    };

    createPolygon = function(coordinateArray, style) {
        return L.polygon(
            [
                this.convertCoordinateArrayToLatLngArray(
                    coordinateArray
                )
            ],
            style
        );
    };

    getPolygonID = function(layer, polygon) {
        for (var polygonID in layer._layers) {
            if (this.polygonIsEqualTo(polygon, layer._layers[polygonID])) {
                return polygonID;
            }
        }
        return null;
    }

    updatePolygonsInLayerFromCoordinateArray = function(layer, coordinateArray, style) {
        this.resetLayer(layer);
        this.displayPolygonsInLayerFromCoordinateArray(layer, coordinateArray, style);
    }

    displayPolygonsInLayerFromCoordinateArray = function(layer, coordinateArray, style) {
        for (i = 0; i < coordinateArray.length; i++) {
            var polygon = this.createPolygon(coordinateArray[i], style);
            layer.addLayer(polygon);
        }
    };

    removePolygonsFromLayerFromCoorindateArray = function(layer, coordinateArray, style) {
        for (i = 0; i < coordinateArray.length; i++) {
            var polygon = this.createPolygon(coordinateArray[i], style);
            var id = this.getPolygonID(layer, polygon);
            if (id != null) {
                layer.removeLayer(id);
            }
        }
    };

    togglePolygonsInLayerFromCoordinateArray = function(layer, coordinateArray, style) {
        for (i = 0; i < coordinateArray.length; i++) {
            var polygon = this.createPolygon(coordinateArray[i], style);

            var id = this.getPolygonID(layer, polygon);
            if (id != null) {
                layer.removeLayer(id);
            } else {
                layer.addLayer(polygon);
            }
        }
    }

    createPolygonLayerFromCoordinateArray = function(coordinateArray, style) {
        var layer = new L.FeatureGroup();

        for (i = 0; i < coordinateArray.length; i++) {
            var polygon = L.polygon(
                [
                    this.convertCoordinateArrayToLatLngArray(
                        coordinateArray[i]
                    )
                ], 
                style
            );
            layer.addLayer(polygon);
        }

        return layer;
    };

    /**
     * Returns a layer containing the geojson with the onEachFeature function applied to each feature.
     * 
     * @param {*} map the map
     * @param {*} geoJson the geojson
     * @param {*} onEachFeature the function that should be applied on each feature
     */
    createLayerFromGeoJson = function(geoJson, onEachFeature) {
        return L.geoJson(geoJson, {
            onEachFeature: onEachFeature
        })
    };

    /**
     * Displays the submitted GeoJson on the leaflet map.
     * 
     * @param {*} map the leaflet map
     * @param {*} geoJson the submitted geoJson
     * @param {*} style the defined style
     */
    displayGeoJSONWithStyle = function(map, geoJson, style) {
        L.geoJSON(geoJson, {
            style: style,
            onEachFeature: this.bindPopupContent
        }).addTo(map);
    };

    /**
      * Convert a latitude longitude json to a coordinate.
      * 
      * @param {*} latLng the latitude longitude json
      */
    convertLatLngToCoordinate = function(latLng) {
        return [latLng.lng, latLng.lat];
    }

    /**
      * Converts each entry of the submitted latitude longitude json array into a coordinate array.
      * 
      * @param {*} latLngArray an array of latitude longitude jsons
      */
    convertLatLngArrayToCoordinateArray = function(latLngArray) {
        var array = [];
        for (i = 0; i < latLngArray.length; i++) {
            array.push(
                this.convertLatLngToCoordinate(
                    latLngArray[i]
                )
            );
        }
        return array;
    }

    /**
      * Convert a coordinate to a latitude longitude json.
      * 
      * @param {*} coordinate a coordinate
      */
    convertCoordinateToLatLng = function(coordinate) {
        return new L.latLng(coordinate[1], coordinate[0]);
    }

    /**
      * Converts each entry of the submitted coordinate array into a latitude longitude json array.
      * 
      * @param {*} latLngArray an array of coordinates
      */
    convertCoordinateArrayToLatLngArray = function(coordinateArray) {
        var array = [];
        for(i = 0; i < coordinateArray.length; i++) {
            array.push(
                this.convertCoordinateToLatLng(
                    coordinateArray[i]
                )
            );
        }
        return array;
    }

    /**
     * Returns the submitted coordinate with switched latitude and longitude.
     * 
     * @param {*} coordinates the submitted coordinate
     */
    switchLatLon = function(coordinate) {
        return [coordinate[1], coordinate[0], coordinate[2]];
    };
    
    /**
     * Returns the submitted coordinates with switched latitude and longitude.
     * 
     * @param {*} coordinates the submitted coordinates
     */
    switchLatLonForEach = function(coordinates) {
        var formattedCoordinates = [];
        var LeafletUtil = this;
        coordinates.forEach(function(element) {
            formattedCoordinates.push(LeafletUtil.switchLatLon(element));
        });
        return formattedCoordinates;
    };

    polygonIsEqualTo = function(polygonLayer, otherPolygonLayer) {
        var latLngsMatch = true;

        var polygonLatLngArray = polygonLayer._latlngs[0];
        var otherPolygonLatLngArray = otherPolygonLayer._latlngs[0];

        for (i = 0; i < polygonLatLngArray.length; i++) {
            if ((polygonLatLngArray[i].lat != otherPolygonLatLngArray[i].lat)
                || (polygonLatLngArray[i].lng != otherPolygonLatLngArray[i].lng)) {
                    latLngsMatch = false;
            }
        }

        return latLngsMatch;
    }

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
    getStyle = function(min, max, value, colorGradient, fillOpacity, borderOpacity, borderWeight, emptyClusterStyle) {
        var style;
        if (!isNaN(value) && (value != null)) {
            style = {
                "fillColor": colorGradient.getColor(min, max, value).getHex(),
                "fillOpacity": fillOpacity,
                "color": colorGradient.getColor(min, max, value).getHex(),
                "opacity": borderOpacity,
                "weight": borderWeight
            }
        } else {
            style = emptyClusterStyle;
        }
        return style;
    };

    /*
    * Initiate a leaflet map.
    */
    createLeafletMap = function(container, baseMapURL, baseMapAttributes, mapBounds, coordinates, zoomLevel, fullscreenAvailable, mouseCoordinatesVisible) {

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
                // markerProps: {}, //optional default {},
            }).addTo(map);
        }
        
        this.addBaseMap(map, baseMapURL, baseMapAttributes, coordinates, zoomLevel);
    
        return map;
    };

    /**
     * Add a base map to the submitted leaflet map at the given coordinates and with the given zoom level.
     * 
     * @param {*} map the leaflet map
     * @param {*} baseMapURL the URL of the base map
     * @param {*} baseMapAttributes the attributes of the base map
     * @param {*} coordinates the initial coordinates
     * @param {*} zoomLevel the initial zoom level
     */
    addBaseMap = function(map, baseMapURL, baseMapAttributes, coordinates, zoomLevel) {
        var baseMap = new L.tileLayer(baseMapURL, baseMapAttributes);

        map.setView(coordinates, zoomLevel).addLayer(baseMap);
    };

    createLegend = function(map, rangeColorArray, observationType) {
        var legend = L.control({position: 'bottomleft'});

        legend.onAdd = function (map) {

            var ranges = [];
            var colors = [];
            for (i = 0; i < rangeColorArray.length; i++) {
                var prefix;

                if (i == 0) {
                    prefix = "< ";
                } else if (i == (rangeColorArray.length - 1)) {
                    prefix = "> ";
                } else {
                    prefix = "";    
                }

                ranges.push(
                    prefix + rangeColorArray[i][0]
                );
                colors.push(
                    rangeColorArray[i][1]
                );
            }
    
            var div = L.DomUtil.create('div', 'info legend');
            div.innerHTML += "<h6><b>" + observationType + "<b></h6>";

            // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = (ranges.length - 1); i >= 0; i--) {
                div.innerHTML +=
                    '<i style="background:' + colors[i].getHex() + '"></i> ' +
                    ranges[i] + '<br>';
            }

            return div;
        };

        return legend;
    };

    addLayer = function(map, layer) {
        layer.addTo(map);
    };

    // Used for function timeout to prevent excessive mousemove event handling
    var mousemoveListenerEnabled = true;
    initializeLeafletMap = function(map, onClick, onHover, onMouseOut, onMoveEnd) {
        map.on("click", function(e) {
            onClick(e);
        });

        map.on("mousemove", function(e) {
            if (mousemoveListenerEnabled) {
                onHover(e);
                mousemoveListenerEnabled = false;
                setTimeout(
                    function() {
                        mousemoveListenerEnabled = true;
                    }, 
                    50
                );
            }
        });

        map.on("mouseout", function() {
            onMouseOut();
        });

        map.on("zoomend", function() {
            onMoveEnd();
        });

        map.on("dragend", function() {
            onMoveEnd();
        });
    };

    return {
        drawPoint,
        drawLine,
        drawPolygon,
        createLayer,
        resetLayer,
        createPolygon,
        getPolygonID,
        updatePolygonsInLayerFromCoordinateArray,
        displayPolygonsInLayerFromCoordinateArray,
        removePolygonsFromLayerFromCoorindateArray,
        togglePolygonsInLayerFromCoordinateArray,
        createPolygonLayerFromCoordinateArray,
        createLayerFromGeoJson,
        displayGeoJSONWithStyle,
        convertLatLngToCoordinate,
        convertLatLngArrayToCoordinateArray,
        convertCoordinateToLatLng,
        convertCoordinateArrayToLatLngArray,
        switchLatLon,
        switchLatLonForEach,
        polygonIsEqualTo,
        getStyle,
        createLeafletMap,
        addBaseMap,
        createLegend,
        addLayer,
        initializeLeafletMap
    };
});