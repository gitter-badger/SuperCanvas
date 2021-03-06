var assert = require("assert");

describe('Path', function(){
    var Path = require("../").Path;
    describe('#parsePath', function(){
        it("Should parse a SVG path", function() {
            assert.deepEqual(
                Path.parsePath("M10, 10 100,100"),
                [
                    ["M", 10, 10],
                    ["L", 100, 100]
                ]
            );
        });

        it("Should handle subsequent move to as lines", function() {
            assert.deepEqual(
                Path.parsePath("m10, 10 100,100"),
                [
                    ["m", 10, 10],
                    ["l", 100, 100]
                ]
            );
        });
    });

    describe('#getExtents', function(){
        it("Should work with simple paths", function() {
            assert.deepEqual(
                Path.getExtents("m10, 10 100,100"),
                {
                    left: 10,
                    right: 110,
                    top: 10,
                    bottom: 110
                }
            );
        });

        it("Quadratic Paths", function() {

            assert.deepEqual(
                Path.getExtents("M0, 0 Q10,12 20,0"),
                {
                    left: 0,
                    right: 20,
                    top: 0,
                    bottom: 6
                }
            );
        });

        it("Cubic Paths", function() {


            assert.deepEqual(
                Path.getExtents("M0, 0 C10,12 20,12 30, 0"),
                {
                    left: 0,
                    right: 30,
                    top: 0,
                    bottom: 9
                }
            );
        });

        it("Convoluted Paths", function() {
            var p = [
                ["M", 627.126, 863.319],
                ["l", 0, -113.121],
                ["l", 196.076, -14.6903],
                ["l", -28.2026, 178.962],
                ["l", -124.756, 10.4294],
                ["l", 160.028, -100.409],
                ["l", 106.853, 10.498],
                ["l", -2.30311, -154.82],
                ["l", -177.831, 122.246],
                ["c", 0, 0, -84.5575, 248.581, 90.6054, 113.218],
                ["c", 175.163, -135.364, 263.335, -126.804, 147.309, -166.6],
                ["c", -116.025, -39.7962, -149.646, -40.975, -111.814, -99.8304],
                ["c", 37.8323, -58.8551, 142.581, -48.647, 38.3266, -58.7365],
                ["c", -104.254, -10.0894, -294.292, 272.855, -294.292, 272.855],
                ["l", 0.00139755, -0.000399194],
                ["Z"]
            ];
            var extents = Path.getExtents(p);
            //console.log(Path.each(p).map(function(e){return e.join(' ');}).join(' '));
            assert.deepEqual(
                {
                    left  : extents.left.toFixed(2),
                    right : extents.right.toFixed(2),
                    top   : extents.top.toFixed(2),
                    bottom: extents.bottom.toFixed(2),
                },
                {
                    bottom: "955.98",
                    left: "627.13",
                    right: "1047.43",
                    top: "590.20"
                }
            );
        });
    });

    describe('#each', function(){
        it("Should make paths absolute", function(){
            assert.deepEqual(
                Path.each([
                    ["m", 10, 15],
                    ["l", 20, 25]
                ]),
                [
                    ["M", 10, 15],
                    ["L", 30, 40]
                ]
            );
        });
        it("Should remove shorthand properties", function(){
            assert.deepEqual(
                Path.each([
                    ["M", 10, 15],
                    ["v", 15]
                ]),
                [
                    ["M", 10, 15],
                    ["L", 10, 30]
                ]
            );

            assert.deepEqual(
                Path.each([
                    ["M", 10, 15],
                    ["h", 15]
                ]),
                [
                    ["M", 10, 15],
                    ["L", 25, 15]
                ]
            );

            assert.deepEqual(
                Path.each([//M0,0Q150, 0 150, 150T50,50
                    ["M", 0, 0],
                    ["Q", 150, 0, 150, 150],
                    ["T", 50, 50]
                ]),
                [
                    ["M", 0, 0],
                    ["Q", 150, 0, 150, 150],
                    ["Q", 150, 300, 50, 50]
                ]
            );

            assert.deepEqual(
                Path.each([//M0,0C100,0 0,100 100,100S0,0 50,50
                    ["M", 0, 0],
                    ["C", 100, 0, 0, 100, 100,100],
                    ["S", 0, 0, 50, 50]
                ]),
                [//M0,0C100,0 0,100 100,100C200,100 0,0 50,50
                    ["M", 0, 0],
                    ["C", 100, 0, 0, 100, 100,100],
                    ["C", 200, 100, 0, 0, 50, 50]
                ]
            );
        });
    });
});