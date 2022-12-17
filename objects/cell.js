"use strict";
exports.__esModule = true;
exports.Cell = void 0;
var objects_1 = require("./objects");
var Cell = /** @class */ (function () {
    function Cell(i, j, occupied) {
        this.occupied = false;
        this.i = i;
        this.j = j;
        this.pos = { x: i, y: j };
        this.occupied = occupied;
    }
    Cell.prototype.flip = function () {
        this.occupied = !this.occupied;
    };
    Cell.prototype.getMove = function (map) {
        var left = [-1, 1];
        var bottom = [0, 1];
        var right = [1, 1];
        var movement = [bottom, left, right];
        for (var i = 0; i < 3; i++) {
            var possibleNeighbor = { x: this.pos.x + movement[i][0], y: this.pos.y + movement[i][1] };
            //  console.log(possibleNeighbor)
            var neighborInMap = map.get((0, objects_1.vecToString)(possibleNeighbor));
            //  console.log(neighborInMap)
            if (neighborInMap == null)
                return undefined;
            if (neighborInMap.occupied)
                continue;
            return neighborInMap;
        }
        return null;
    };
    return Cell;
}());
exports.Cell = Cell;
