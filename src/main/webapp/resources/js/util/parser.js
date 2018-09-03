define(function() {
    separatedToArray = function(input, separator) {
        var output = [];
        if (input != undefined) {
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

    return {
        separatedToArray,
        arrayStringToArray,
        jsonStringToObject
    }
})