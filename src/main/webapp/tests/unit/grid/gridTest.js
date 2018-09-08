define(['grid', 'bounds'], function(Grid, Bounds) {
    describe("grid/grid", function() {
        var grid;

        var gridID = "recursiveRectangleGrid-2_2_3";

        describe("constructor", function() {
            it("valid initialization", function() {

            });

            it("invalid initialization", function() {

            });
        });

        describe("setters and getters", function() {
            it("set bounds", function() {

            });

            it("get bounds", function() {

            });

            it("set rows", function() {

            });

            it("get rows", function() {

            });

            it("set columns", function() {

            });

            it("get columns", function() {

            });

            it("set gridLevels", function() {

            });

            it("get gridLevels", function() {

            });
        });

        describe("methods", function() {
            var closestCoordinateInBoundsParam1 = [new Bounds([0, 0], [100, 100]), [50, 50], [50, 50]];
            var closestCoordinateInBoundsParam2 = [new Bounds([-50, 0], [50, 100]), [100, 0], [50, 0]];
            var closestCoordinateInBoundsParam3 = [new Bounds([50, 50], [100, 100]), [0, 0], [50, 50]];
            
            beforeAll(function() {
                grid = new Grid(gridID);
            });

            it("get grid identifier", function() {

            });

            it("get cluster containing coordinate", function() {

            });

            it("get clusters contained in bounds", function() {

            });

            it("closest coordinate in bounds", function() {
                expect(
                    grid.closestCoordinateInBounds(
                        closestCoordinateInBoundsParam1[0],
                        closestCoordinateInBoundsParam1[1]
                    )
                ).toEqual(closestCoordinateInBoundsParam1[2]);

                expect(
                    grid.closestCoordinateInBounds(
                        closestCoordinateInBoundsParam2[0],
                        closestCoordinateInBoundsParam2[1]
                    )
                ).toEqual(closestCoordinateInBoundsParam2[2]);

                expect(
                    grid.closestCoordinateInBounds(
                        closestCoordinateInBoundsParam3[0],
                        closestCoordinateInBoundsParam3[1]
                    )
                ).toEqual(closestCoordinateInBoundsParam3[2]);
            });
        });
    });
});