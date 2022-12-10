"use strict";
exports.__esModule = true;
exports.formatStringMatrix = exports.formatString = void 0;
var formatString = function (x) { return '' + x; };
exports.formatString = formatString;
var formatStringMatrix = function (m) { return m.map(function (r) { return r.map(exports.formatString).join(' '); }).join("\n"); };
exports.formatStringMatrix = formatStringMatrix;
