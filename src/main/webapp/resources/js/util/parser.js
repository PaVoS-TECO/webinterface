define(['bounds', 'color', 'multiColorGradient'], function(Bounds, Color, MultiColorGradient) {
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

    colorGradientRangeJsonToGradientJson =  function(input) {
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

    return {
        separatedToArray,
        arrayStringToArray,
        jsonStringToObject,
        parseJsonToBounds,
        colorGradientRangeJsonToGradientJson,
        colorGradientRangeJsonToRangeJson
    }
})