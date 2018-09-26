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
            var getClusterContainingCoordinateParams1 = [[0, 0], 2, new RecursiveRectangleCluster(gridID + ":" + "2_2-2_0", [])];
            var getClusterContainingCoordinateParams2 = [[151, 51], 2, new RecursiveRectangleCluster("", [])];
            var getClustersContainedInBoundsParams1 = [bounds, 1, [new RecursiveRectangleCluster("", [])]];
            var getClustersContainedInBoundsParams2 = [new Bounds([], []), 1, [new RecursiveRectangleCluster("", [])]];
            var getClustersContainedInBoundsParams3 = [new Bounds([], []), 1, [new RecursiveRectangleCluster("", [])]];
            var getGridIDParams1 = [gridID];
            var isValidClusterIDParams1 = ["recursiveRectangleGrid-5_4_3:1_1-2_2", true];
            var isValidClusterIDParams2 = ["recursiveRectangleGrid-5_4_3:1_1-2_2-3_3-4_4", false];
            
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

            it("is valid cluster identifier", function() {
                expect(
                    recursiveRectangleGrid.isValidClusterID(
                        isValidClusterIDParams1[0]
                    )
                ).toEqual(isValidClusterIDParams1[1]);

                expect(
                    recursiveRectangleGrid.isValidClusterID(
                        isValidClusterIDParams2[0]
                    )
                ).toEqual(isValidClusterIDParams2[1]);
            });
        });
    });
});