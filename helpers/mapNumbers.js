"use strict";
exports.__esModule = true;
exports.map_range = void 0;
function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
exports.map_range = map_range;
