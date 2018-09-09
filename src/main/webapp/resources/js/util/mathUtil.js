define(function() {
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

    return {
        mod,
        indexOfValueInSortedArray
    };
});