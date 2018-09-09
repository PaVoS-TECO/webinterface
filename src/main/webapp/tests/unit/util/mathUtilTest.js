define(['mathUtil'], function(MathUtil) {
    describe("util/mathUtil", function() {
        describe("methods", function() {
            var indexOfValueInSortedArrayParams1 = [[1, 2, 4, 8], 5, 2];
            var indexOfValueInSortedArrayParams2 = [[1, 2, 4, 8], 10, 3];
            var indexOfValueInSortedArrayParams3 = [[1, 2, 4, 8], 0, -1];

            it("positive value test", function() {
                expect(MathUtil.mod(25, 7)).toEqual(4);
            });

            it("negative value test", function() {
                expect(MathUtil.mod(-9, 2)).toEqual(1);
            });

            it("index of value in sorted array", function() {
                expect(
                    MathUtil.indexOfValueInSortedArray(
                        indexOfValueInSortedArrayParams1[0],
                        indexOfValueInSortedArrayParams1[1]
                    )
                ).toEqual(indexOfValueInSortedArrayParams1[2]);

                expect(
                    MathUtil.indexOfValueInSortedArray(
                        indexOfValueInSortedArrayParams2[0],
                        indexOfValueInSortedArrayParams2[1]
                    )
                ).toEqual(indexOfValueInSortedArrayParams2[2]);

                expect(
                    MathUtil.indexOfValueInSortedArray(
                        indexOfValueInSortedArrayParams3[0],
                        indexOfValueInSortedArrayParams3[1]
                    )
                ).toEqual(indexOfValueInSortedArrayParams3[2]);
            });
        });
    });
});