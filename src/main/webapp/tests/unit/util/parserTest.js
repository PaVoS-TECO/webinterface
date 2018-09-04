define(['parser', 'bounds', 'color', 'multiColorGradient'],
function(Parser, Bounds, Color, MultiColorGradient) {
    describe("util/parser", function() {
        describe("methods", function() {
            var comma = ',';
            var validCommaSeparatedString = 'a,b,c';
            var validCommaSeparated = ["a", "b", "c"];
            var invalidCommaSeparatedString = null;
            var invalidCommaSeparated = [];

            var validArrayString = '["x", "y", "z"]';
            var validArray = ["x", "y", "z"];
            var invalidArrayString = '["x", "y"';
            var invalidArray = [];

            var validJsonString = '{ "this": "that", "values": { "then": 4, "now": 5 } }';
            var validJson = { "this": "that", "values": { "then": 4, "now": 5 } };
            var invalidJsonString = '{"this": that"';
            var invalidJson = {};

            var colorGradientRangeJson = { "temperature": { "gradient": ["#ffffff", "#cb53aa", "#860083", "#1d008d", "#003fff", "#26fee6", "#fdfd00", "#ff1400", "#520002"], "_celsius": [-50.0, 30.0], "_fahrenheit": [-58.0, 86.0] } };
            var gradient = new MultiColorGradient([new Color("#ffffff"), new Color("#cb53aa"), new Color("#860083"), new Color("#1d008d"), new Color("#003fff"), new Color("#26fee6"), new Color("#fdfd00"), new Color("#ff1400"), new Color("#520002")]);
            var gradientJson = { "temperature_celsius": gradient, "temperature_fahrenheit": gradient };
            var rangeJson = { "temperature_celsius": [-50.0, 30.0], "temperature_fahrenheit": [-58.0, 86.0] };

            it("parse valid comma separated string to array", function() {
                expect(Parser.separatedToArray(validCommaSeparatedString, comma)).toEqual(validCommaSeparated);
            });

            it("parse invalid comma separated string to array", function() {
                expect(Parser.separatedToArray(invalidCommaSeparatedString, comma)).toEqual(invalidCommaSeparated);
            });

            it("parse valid array string to array", function() {
                expect(Parser.arrayStringToArray(validArrayString)).toEqual(validArray);
            });

            it("parse invalid array string to array", function() {
                expect(Parser.arrayStringToArray(invalidArrayString)).toEqual(invalidArray);
            });

            it("parse valid json string to object", function() {
                expect(Parser.jsonStringToObject(validJsonString)).toEqual(validJson);
            });

            it("parse invalid json string to object", function() {
                expect(Parser.jsonStringToObject(invalidJsonString)).toEqual(invalidJson);
            });

            it("parse valid json to bounds", function() {

            });

            it("parse invalid json to bounds", function() {

            });

            it("parse color gradient range json to gradient json", function() {
                expect(Parser.colorGradientRangeJsonToGradientJson(colorGradientRangeJson)).toEqual(gradientJson);
            });

            it("parse color gradient range json to range json", function() {
                expect(Parser.colorGradientRangeJsonToRangeJson(colorGradientRangeJson)).toEqual(rangeJson);
            });
        });
    });
});