"use strict";
exports.__esModule = true;
exports.makeMatrixS = exports.makeMatrix = void 0;
var makeMatrix = function (m, n, value) {
    var out = [];
    for (var j = 0; j < n; ++j) {
        out[j] = [];
        for (var i = 0; i < m; ++i) {
            // @ts-ignore
            out[j][i] = value && value.apply ? value(i, j) : value;
        }
    }
    return out;
};
exports.makeMatrix = makeMatrix;
var makeMatrixS = function (m, n, value) {
    var out = [];
    for (var j = 0; j < n; ++j) {
        out[j] = [];
        for (var i = 0; i < m; ++i) {
            // @ts-ignore
            out[j][i] = value;
        }
    }
    return out;
};
exports.makeMatrixS = makeMatrixS;
