"use strict";
exports.__esModule = true;
exports.intToVec = exports.vecToInt = exports.vecToString = void 0;
var vecToString = function (v) {
    return "".concat(v.x, ", ").concat(v.y);
};
exports.vecToString = vecToString;
var vecToInt = function (vec) {
    return vec.y * 1e3 + vec.x;
};
exports.vecToInt = vecToInt;
var intToVec = function (i) {
    return {
        y: Math.floor(i / 1e3),
        x: i % 1e3
    };
};
exports.intToVec = intToVec;
