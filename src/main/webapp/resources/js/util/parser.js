define(['bounds', 'color', 'multiColorGradient', 'recursiveRectangleGrid'],
function(Bounds, Color, MultiColorGradient, RecursiveRectangleGrid) {
    separatedToArray = function(input, separator) {
        var output = [];
        if ((input != undefined) && (input != null)) {
            array = String(input).split(separator);
            for (i = 0; i < array.length; i++) {
                output.push(array[i]);
            }
        } else {
            console.error("input is " + undefined);
        }
        return output;
    }

    arrayStringToArray = function(input) {
        var output = [];
        try {
            output = JSON.parse(input);
        } catch {
            console.error(input + " isn't valid json");
        }
        return output;
    }

    jsonStringToObject = function(input) {
        var output = {};
        try {
            output = JSON.parse(input);
        } catch {
            console.error(input + " isn't valid json")
        }
        return output;
    }

    parseJsonToBounds = function(input) {
        var bounds = new Bounds();
        try {
            bounds = new Bounds(JSON.parse(input)[0], JSON.parse(input)[1]);
        } catch {
            console.error(input + " ins't valid for bounds")
        }
        return bounds;
    }

    colorGradientRangeJsonToGradientJson = function(input) {
        var output = {};
        var outerArray = Object.keys(input);
        var colorArray;
        var multiColorGradient;

        var innerArray;
        outerArray.forEach(function(outerElement) {
            colorArray = [];
            input[outerElement]["gradient"].forEach(function(colorHexString) {
                colorArray.push(new Color(colorHexString));
            })
            multiColorGradient = new MultiColorGradient(colorArray);
            innerArray = Object.keys(input[outerElement]);
            innerArray.forEach(function(innerElement) {
                if (innerElement != "gradient") {
                    output[outerElement + innerElement] = multiColorGradient;
                }
            });
        });
        return output;
    }

    colorGradientRangeJsonToRangeJson = function(input) {
        var output = {};
        var outerArray = Object.keys(input);
        var innerArray;
        outerArray.forEach(function(outerElement) {
            innerArray = Object.keys(input[outerElement]);
            innerArray.forEach(function(innerElement) {
                if (innerElement != "gradient") {
                    output[outerElement + innerElement] = input[outerElement][innerElement];
                }
            });
        });
        return output;
    }

    /**
     * Parses the submitted grid id and returns its corresponding grid object.
     */
    parseGridID = function(bounds, gridID) {
        gridType = gridID.split('-')[0];
        gridParameters = gridID.split('-')[1].split('_');

        if (gridType == 'recursiveRectangleGrid') {
            return new RecursiveRectangleGrid(bounds, gridParameters[0], gridParameters[1], gridParameters[2]);
        }
    };

    parseGeoJsonArrayToContentTableArray = function(geoJsonArray) {
        var tableContentArray = [];
        var tableContent;
        var identifierValueArray;
        var contentArray;

        geoJsonArray.forEach(function(geoJson) {
            tableContent = [];
            identifierValueArray = [];
            contentArray = [];

            var featureArray = geoJson["features"];
            featureArray.forEach(function(feature) {
                var identifier = feature["properties"]["clusterID"];
                var value = feature["properties"]["value"];
                identifierValueArray.push([identifier, value]);

                array = feature["properties"]["content"];
                for (contentIndex = 0; contentIndex < array.length; contentIndex++) {
                    contentArray.push([array[contentIndex]]);
                }
            });

            identifierValueArray.forEach(function(element) {
                tableContent.push(element);
            });
            contentArray.forEach(function(element) {
                tableContent.push(element);
            });

            tableContentArray.push(tableContent);
        });

        return tableContentArray;
    }

    return {
        separatedToArray,
        arrayStringToArray,
        jsonStringToObject,
        parseJsonToBounds,
        colorGradientRangeJsonToGradientJson,
        colorGradientRangeJsonToRangeJson,
        parseGridID,
        parseGeoJsonArrayToContentTableArray
    }
})