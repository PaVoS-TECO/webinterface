define(['recursiveRectangleGrid', 'recursiveRectangleCluster', 'bounds', 'dimension'],
function(RecursiveRectangleGrid, RecursiveRectangleCluster, Bounds, Dimension) {
    describe("grid/recursiveRectangleGrid", function() {
        var recursiveRectangleGrid;

        var bounds = new Bounds([-100, -50], [100, 50]);
        var rows = 5;
        var columns = 4;
        var gridLevels = 3;

        describe("constructor", function() {
            it("initialize", function() {
                recursiveRectangleGrid = new RecursiveRectangleGrid(bounds, rows, columns, gridLevels);
                
                expect(recursiveRectangleGrid.getBounds()).toEqual(bounds);
                expect(recursiveRectangleGrid.getRows()).toEqual(rows);
                expect(recursiveRectangleGrid.getColumns()).toEqual(columns);
                expect(recursiveRectangleGrid.getGridLevels()).toEqual(gridLevels);
            });
        });

        describe("setters and getters", function() {
            var newBounds = new Bounds([-50, -100], [50, 100]);
            var newRows = 4;
            var newColumns = 5;
            var newGridLevels = 1;

            beforeEach(function() {
                recursiveRectangleGrid = new RecursiveRectangleGrid(bounds, rows, columns, gridLevels);
            });

            it("set and get bounds", function() {
                recursiveRectangleGrid.setBounds(newBounds);
                expect(recursiveRectangleGrid.getBounds()).toEqual(newBounds);
            });

            it("set and get rows", function() {
                recursiveRectangleGrid.setRows(newRows);
                expect(recursiveRectangleGrid.getRows()).toEqual(newRows);
            });

            it("set and get columns", function() {
                recursiveRectangleGrid.setColumns(newColumns);
                expect(recursiveRectangleGrid.getColumns()).toEqual(newColumns);
            });

            it("set and get grid levels", function() {
                recursiveRectangleGrid.setGridLevels(newGridLevels);
                expect(recursiveRectangleGrid.getGridLevels()).toEqual(newGridLevels);
            });
        });

        describe("methods", function() {
            var gridID = "recursiveRectangleGrid-5_4_3";
            var getClusterContainingCoordinateParams1 = [[0, 0], 2, new RecursiveRectangleCluster(gridID + ":" + "2_2-2_0")];
            var getClusterContainingCoordinateParams2 = [[151, 51], 2, new RecursiveRectangleCluster(gridID + ":" + "2_2-2_0")];
            var getClustersContainedInBoundsParams1 = [bounds, 1, [new RecursiveRectangleCluster("")]];
            var getClustersContainedInBoundsParams2 = [new Bounds([], []), 1, [new RecursiveRectangleCluster("")]];
            var getClustersContainedInBoundsParams3 = [new Bounds([], []), 1, [new RecursiveRectangleCluster("")]];
            var getGridIDParams1 = [gridID];
            var calculateDimensionAtGridLevelParams1 = [new Dimension(1000, 1000), 10, 10, 2, new Dimension(10, 10)];
            var calculateDimensionAtGridLevelParams2 = [new Dimension(360, 180), 6, 6, 2, new Dimension(10, 5)];
            var calculateCoordinateRelativeToBoundsParams1 = [new Bounds([0, 0], [100, 100]), [50, 50], [50, 50]];
            var calculateCoordinateRelativeToBoundsParams2 = [new Bounds([-100, -50], [100, 50]), [50, 25], [150, 75]];
            var createRecursiveRectangleClusterParams1 = [[[4, 1], [2, 2], [0, 0]], new RecursiveRectangleCluster(gridID + ":" + "4_1-2_2-0_0")];
            var createRecursiveRectangleClusterParams2 = [[[0, 0], [4, 4]], new RecursiveRectangleCluster(gridID + ":" + "0_0-4_4")];
            var calculateClusterIDParams1 = [80, 20, 3, "3_1-1_1-0_0"];
            var calculateClusterIDParams2 = [-2, 1, 1, "3_1"];
            var calculateClusterIDParams3 = [17, -9, 2, "3_1-2_3"];

            beforeAll(function() {
                recursiveRectangleGrid = new RecursiveRectangleGrid(bounds, rows, columns, gridLevels);
            });

            it("get cluster containing coordinate", function() {
                expect(
                    recursiveRectangleGrid.getClusterContainingCoordinate(
                        getClusterContainingCoordinateParams1[0],
                        getClusterContainingCoordinateParams1[1]
                    )
                ).toEqual(getClusterContainingCoordinateParams1[2]);

                expect(
                    recursiveRectangleGrid.getClusterContainingCoordinate(
                        getClusterContainingCoordinateParams2[0],
                        getClusterContainingCoordinateParams2[1]
                    )
                ).toEqual(getClusterContainingCoordinateParams2[2]);
            });

            it("getClustersContainedInBounds", function() {
                expect(
                    recursiveRectangleGrid.getClustersContainedInBounds(
                        getClustersContainedInBoundsParams1[0],
                        getClustersContainedInBoundsParams1[1]
                    )
                ).toEqual(getClustersContainedInBoundsParams1[2]);

                expect(
                    recursiveRectangleGrid.getClustersContainedInBounds(
                        getClustersContainedInBoundsParams2[0],
                        getClustersContainedInBoundsParams2[1]
                    )
                ).toEqual(getClustersContainedInBoundsParams2[2]);

                expect(
                    recursiveRectangleGrid.getClustersContainedInBounds(
                        getClustersContainedInBoundsParams3[0],
                        getClustersContainedInBoundsParams3[1]
                    )
                ).toEqual(getClustersContainedInBoundsParams3[2]);
            });

            it("get grid identifier", function() {
                expect(
                    recursiveRectangleGrid.getGridID()
                ).toEqual(getGridIDParams1[0]);
            });

            it("calculate dimension at grid level", function() {
                expect(
                    recursiveRectangleGrid.calculateDimensionAtGridLevel(
                        calculateDimensionAtGridLevelParams1[0],
                        calculateDimensionAtGridLevelParams1[1],
                        calculateDimensionAtGridLevelParams1[2],
                        calculateDimensionAtGridLevelParams1[3]
                    )
                ).toEqual(calculateDimensionAtGridLevelParams1[4]);

                expect(
                    recursiveRectangleGrid.calculateDimensionAtGridLevel(
                        calculateDimensionAtGridLevelParams2[0],
                        calculateDimensionAtGridLevelParams2[1],
                        calculateDimensionAtGridLevelParams2[2],
                        calculateDimensionAtGridLevelParams2[3]
                    )
                ).toEqual(calculateDimensionAtGridLevelParams2[4]);
            });

            it("calculate coordinate relative to bounds", function() {
                expect(
                    recursiveRectangleGrid.calculateCoordinateRelativeToBounds(
                        calculateCoordinateRelativeToBoundsParams1[0],
                        calculateCoordinateRelativeToBoundsParams1[1]
                    )
                ).toEqual(calculateCoordinateRelativeToBoundsParams1[2]);

                expect(
                    recursiveRectangleGrid.calculateCoordinateRelativeToBounds(
                        calculateCoordinateRelativeToBoundsParams2[0],
                        calculateCoordinateRelativeToBoundsParams2[1]
                    )
                ).toEqual(calculateCoordinateRelativeToBoundsParams2[2]);
            });

            it("create recursive rectangle cluster", function() {
                expect(
                    recursiveRectangleGrid.createRecursiveRectangleCluster(
                        createRecursiveRectangleClusterParams1[0]
                    )
                ).toEqual(createRecursiveRectangleClusterParams1[1]);

                expect(
                    recursiveRectangleGrid.createRecursiveRectangleCluster(
                        createRecursiveRectangleClusterParams2[0]
                    )
                ).toEqual(createRecursiveRectangleClusterParams2[1]);
            });

            it("calculate cluster identifier", function() {
                expect(
                    recursiveRectangleGrid.calculateClusterID(
                        calculateClusterIDParams1[0],
                        calculateClusterIDParams1[1],
                        calculateClusterIDParams1[2]
                    )
                ).toEqual(calculateClusterIDParams1[3]);

                expect(
                    recursiveRectangleGrid.calculateClusterID(
                        calculateClusterIDParams2[0],
                        calculateClusterIDParams2[1],
                        calculateClusterIDParams2[2]
                    )
                ).toEqual(calculateClusterIDParams2[3]);

                expect(
                    recursiveRectangleGrid.calculateClusterID(
                        calculateClusterIDParams3[0],
                        calculateClusterIDParams3[1],
                        calculateClusterIDParams3[2]
                    )
                ).toEqual(calculateClusterIDParams3[3]);
            });
        });
    });
});