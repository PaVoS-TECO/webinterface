define(['gridUtil', 'bounds', 'dimension', 'recursiveRectangleGrid'], 
function(GridUtil, Bounds, Dimension, RecursiveRectangleGrid) {
    describe("util/gridUtil", function() {
        describe("methods", function() {
            var gridID = "recursiveRectangleGrid-5_4_3";
            var calculateDimensionAtGridLevelParams1 = [new Dimension(1000, 1000), 10, 10, 2, new Dimension(10, 10)];
            var calculateDimensionAtGridLevelParams2 = [new Dimension(360, 180), 6, 6, 2, new Dimension(10, 5)];
            var calculateCoordinateRelativeToBoundsParams1 = [new Bounds([0, 0], [100, 100]), [50, 50], [50, 50]];
            var calculateCoordinateRelativeToBoundsParams2 = [new Bounds([-100, -50], [100, 50]), [50, 25], [150, 75]];
            var calculateCoordinateRelativeToBoundsParams3 = [new Bounds([-10, -10], [10, 10]), [-20, -20], [-10, -10]];
            var createRecursiveRectangleClusterIDFromArrayParams1 = [gridID, [[4, 1], [2, 2], [0, 0]], (gridID + ":" + "4_1-2_2-0_0")];
            var createRecursiveRectangleClusterIDFromArrayParams2 = [gridID, [[0, 0], [4, 4]], (gridID + ":" + "0_0-4_4")];
            var createRecursiveRectangleClusterIDParams1 = [gridID, 5, 4, 80, 20, 3, (gridID + ":" + "3_1-1_1-0_0")];
            var createRecursiveRectangleClusterIDParams2 = [gridID, 5, 4, -2, 1, 1, (gridID + ":" + "3_1")];
            var createRecursiveRectangleClusterIDParams3 = [gridID, 5, 4, 17, -9, 2, (gridID + ":" + "3_1-2_3")];
            var calculateRecursiveRectangleClusterCoordinatesParams1 = [new Bounds([0, 0], [8, 8]), ("recursiveRectangleGrid-2_2_3" + ":" + "0_0-1_1-1_0"), [[2, 3], [3, 3], [3, 4], [2, 4]]];
            var calculateRecursiveRectangleClusterCoordinatesParams2 = [new Bounds([0, 0], [64, 64]), ("recursiveRectangleGrid-2_4_3" + ":" + "1_2-1_2"), [[40, 48], [44, 48], [44, 64], [40, 64]]];

            it("cluster array to string array", function() {

            });

            it("parse grid identifier", function() {

            });

            it("calculate dimension at grid level", function() {
                expect(
                    GridUtil.calculateDimensionAtGridLevel(
                        calculateDimensionAtGridLevelParams1[0],
                        calculateDimensionAtGridLevelParams1[1],
                        calculateDimensionAtGridLevelParams1[2],
                        calculateDimensionAtGridLevelParams1[3]
                    )
                ).toEqual(calculateDimensionAtGridLevelParams1[4]);

                expect(
                    GridUtil.calculateDimensionAtGridLevel(
                        calculateDimensionAtGridLevelParams2[0],
                        calculateDimensionAtGridLevelParams2[1],
                        calculateDimensionAtGridLevelParams2[2],
                        calculateDimensionAtGridLevelParams2[3]
                    )
                ).toEqual(calculateDimensionAtGridLevelParams2[4]);
            });

            it("calculate coordinate relative to bounds", function() {
                expect(
                    GridUtil.calculateCoordinateRelativeToBounds(
                        calculateCoordinateRelativeToBoundsParams1[0],
                        calculateCoordinateRelativeToBoundsParams1[1]
                    )
                ).toEqual(calculateCoordinateRelativeToBoundsParams1[2]);

                expect(
                    GridUtil.calculateCoordinateRelativeToBounds(
                        calculateCoordinateRelativeToBoundsParams2[0],
                        calculateCoordinateRelativeToBoundsParams2[1]
                    )
                ).toEqual(calculateCoordinateRelativeToBoundsParams2[2]);

                expect(
                    GridUtil.calculateCoordinateRelativeToBounds(
                        calculateCoordinateRelativeToBoundsParams3[0],
                        calculateCoordinateRelativeToBoundsParams3[1]
                    )
                ).toEqual(calculateCoordinateRelativeToBoundsParams3[2]);
            });

            it("create recursive rectangle cluster identifier with array", function() {
                expect(
                    GridUtil.createRecursiveRectangleClusterIDFromArray(
                        createRecursiveRectangleClusterIDFromArrayParams1[0],
                        createRecursiveRectangleClusterIDFromArrayParams1[1]
                    )
                ).toEqual(createRecursiveRectangleClusterIDFromArrayParams1[2]);

                expect(
                    GridUtil.createRecursiveRectangleClusterIDFromArray(
                        createRecursiveRectangleClusterIDFromArrayParams2[0],
                        createRecursiveRectangleClusterIDFromArrayParams2[1]
                    )
                ).toEqual(createRecursiveRectangleClusterIDFromArrayParams2[2]);
            });

            it("create recursive rectangle cluster identifier", function() {
                expect(
                    GridUtil.createRecursiveRectangleClusterID(
                        createRecursiveRectangleClusterIDParams1[0],
                        createRecursiveRectangleClusterIDParams1[1],
                        createRecursiveRectangleClusterIDParams1[2],
                        createRecursiveRectangleClusterIDParams1[3],
                        createRecursiveRectangleClusterIDParams1[4],
                        createRecursiveRectangleClusterIDParams1[5]
                    )
                ).toEqual(createRecursiveRectangleClusterIDParams1[6]);

                expect(
                    GridUtil.createRecursiveRectangleClusterID(
                        createRecursiveRectangleClusterIDParams2[0],
                        createRecursiveRectangleClusterIDParams2[1],
                        createRecursiveRectangleClusterIDParams2[2],
                        createRecursiveRectangleClusterIDParams2[3],
                        createRecursiveRectangleClusterIDParams2[4],
                        createRecursiveRectangleClusterIDParams2[5]
                    )
                ).toEqual(createRecursiveRectangleClusterIDParams2[6]);

                expect(
                    GridUtil.createRecursiveRectangleClusterID(
                        createRecursiveRectangleClusterIDParams3[0],
                        createRecursiveRectangleClusterIDParams3[1],
                        createRecursiveRectangleClusterIDParams3[2],
                        createRecursiveRectangleClusterIDParams3[3],
                        createRecursiveRectangleClusterIDParams3[4],
                        createRecursiveRectangleClusterIDParams3[5]
                    )
                ).toEqual(createRecursiveRectangleClusterIDParams3[6]);
            });

            it("calculate recursive rectangle cluster coordinates", function() {
                expect(
                    GridUtil.calculateRecursiveRectangleClusterCoordinates(
                        calculateRecursiveRectangleClusterCoordinatesParams1[0],
                        calculateRecursiveRectangleClusterCoordinatesParams1[1],
                    )
                ).toEqual(calculateRecursiveRectangleClusterCoordinatesParams1[2]);

                expect(
                    GridUtil.calculateRecursiveRectangleClusterCoordinates(
                        calculateRecursiveRectangleClusterCoordinatesParams2[0],
                        calculateRecursiveRectangleClusterCoordinatesParams2[1],
                    )
                ).toEqual(calculateRecursiveRectangleClusterCoordinatesParams2[2]);
            });
        });
    });
});