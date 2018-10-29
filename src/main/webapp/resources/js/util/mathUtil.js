define(function() {
    /**
      * Returns a random integer in the range between min and max.
      * 
      * @param {*} min the minimum value
      * @param {*} max the maximum value
      */
    randomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /**
      * Returns a random float in the range between min and max. Cuts off the decimal
      * part according to the submitted fractional part.
      * 
      * @param {*} min the minimum value
      * @param {*} max the maximum value
      * @param {*} fractionalPart the fractional part
      */
    randomFloat = function(min, max, fractionalPart) {
        return (Math.random() * (max - min + 1) + min).toFixed(fractionalPart);
    }

    /**
      * Returns a pseudo normal distributed random float in the range between min and max. 
      * The higher the depth the more normal distributed the values are. Cuts off the decimal 
      * part according to the submitted fractional part.
      * 
      * @param {*} min the minimum value
      * @param {*} max the maximum value
      * @param {*} depth the depth
      * @param {*} fractionalPart the fractional part
      */
    randomFloatPseudoNormalDistribution = function(min, max, depth, fractionalPart) {
        var value = 0;
        for (var i = 0; i < depth; i++) {
            value = value + Math.random();
        }
        value = value / depth;

        return (value * (max - min + 1) + min).toFixed(fractionalPart);
    }

    /**
      * The modulo operator which turns negative results into their positive equivalent.
      * 
      * For Example: -2 mod 5 = -2 -> -2 mod 5 = 3
      * 
      * @param {*} value the value
      * @param {*} mod the modulo
      */
    mod = function(value, mod) {
        return (((value % mod) + mod) % mod);
    };

    /**
      * Returns the index of the biggest value of the sorted array that is smaller than or 
      * equal to the submitted value. Returns -1 if the value is smaller than the smallest
      * value of the sorted array.
      * 
      * @param {*} array the sorted array
      * @param {*} value the value
      */
    indexOfValueInSortedArray = function(array, value) {
        var index = -1;
        for(i = 0; i < array.length; i++) {
            if (array[i] > value) {
                return index;
            } else {
                index++;
            }
        }
        return index;
    };

    /**
      * Cuts off the decimal part of the submitted value according to the submitted fractional part.
      * 
      * @param {*} value the value
      * @param {*} fractionalPart the fractional part
      */
    cutoffDecimal = function(value, fractionalPart) {
        return Math.round(value * Math.pow(10, fractionalPart)) / Math.pow(10, fractionalPart);
    }

    /**
      * Calculates the centroid of the submitted coordinate array.
      * 
      * @param {*} array an array of coordinates
      */
    calculateCentroid = function(array) {
        var x = 0;
        var y = 0;

        for (i = 0; i < array.length; i++) {
            x += array[i][0];
            y += array[i][1];
        }

        return [(x / array.length), (y / array.length)];
    }

    return {
        randomInt,
        randomFloat,
        randomFloatPseudoNormalDistribution,
        mod,
        indexOfValueInSortedArray,
        cutoffDecimal,
        calculateCentroid
    };
});