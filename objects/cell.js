"use strict";
exports.__esModule = true;
exports.Cell = void 0;
var objects_1 = require("./objects");
var Cell = /** @class */ (function () {
    function Cell(i, j, occupied) {
        this.type = 0;
        this.occupied = false;
        this.i = i;
        this.j = j;
        this.pos = { x: i, y: j };
        this.occupied = occupied;
    }
    Cell.prototype.setType = function (n) {
        this.type = n;
    };
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
            var neighborInMap = map.get((0, objects_1.vecToString)(possibleNeighbor));
            if (neighborInMap == null)
                return undefined;
            if (neighborInMap.occupied)
                continue;
            return neighborInMap;
        }
        return null;
    };
    Cell.prototype.getMove2 = function (map, maxHeight) {
        var left = [-1, 1];
        var bottom = [0, 1];
        var right = [1, 1];
        var movement = [bottom, left, right];
        var allNeighborsInFirstRow = 0;
        var allThreeOcupied = 0;
        for (var i = 0; i < 3; i++) {
            var possibleNeighbor = { x: this.pos.x + movement[i][0], y: this.pos.y + movement[i][1] };
            if (possibleNeighbor.y === 1)
                allNeighborsInFirstRow++;
            var neighborInMap = map.get((0, objects_1.vecToString)(possibleNeighbor));
            if (neighborInMap != null) {
                if (neighborInMap.occupied)
                    allThreeOcupied++;
            }
        }
        if (allNeighborsInFirstRow && allThreeOcupied === 3)
            return undefined; //return if stuck at the beginning
        //otherwise proceed as normal
        for (var i = 0; i < 3; i++) {
            var possibleNeighbor = { x: this.pos.x + movement[i][0], y: this.pos.y + movement[i][1] };
            var neighborInMap = map.get((0, objects_1.vecToString)(possibleNeighbor));
            //if null, add to map, and continue, unless new cell is unoccupied, else return it
            if (neighborInMap == null) {
                var occupied = possibleNeighbor.y === maxHeight - 2 ? true : false;
                var newCell = new Cell(possibleNeighbor.x, possibleNeighbor.y, occupied);
                map.set((0, objects_1.vecToString)(newCell.pos), newCell);
                if (!occupied)
                    return newCell;
                continue;
            }
            if (neighborInMap.occupied)
                continue;
            return neighborInMap;
        }
        return null;
    };
    Cell.prototype.markMapAsOccupied = function (map, manhattan) {
        var updatedX;
        var updatedY;
        var pos;
        var mapped;
        var cell;
        for (var i = 0; i <= manhattan; i++) {
            for (var j = manhattan; j >= 0; j--) {
                for (var k = -1; k <= 1; k++) {
                    for (var h = -1; h <= 1; h++) {
                        if (Math.abs(i * h) + Math.abs(j * k) <= manhattan) {
                            updatedX = this.pos.x + (j * k);
                            updatedY = this.pos.y + (i * h);
                            pos = { x: updatedX, y: updatedY };
                            mapped = map.get((0, objects_1.vecToString)(pos));
                            if (mapped === undefined) {
                                cell = new Cell(pos.x, pos.y, true);
                                cell.setType(1);
                                map.set((0, objects_1.vecToString)(cell.pos), cell);
                            }
                        }
                    }
                }
            }
        }
    };
    return Cell;
}());
exports.Cell = Cell;
