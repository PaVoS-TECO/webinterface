define(['mathUtil'], function(MathUtil) {
    describe("util/mathUtil", function() {
        describe("methods", function() {
            it("positive value test", function() {
                expect(MathUtil.mod(25, 7)).toEqual(4);
            });

            it("negative value test", function() {
                expect(MathUtil.mod(-9, 2)).toEqual(1);
            });
        });
    });
});