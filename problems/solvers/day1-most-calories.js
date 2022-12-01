"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
exports.__esModule = true;
exports.identifyHighestCalorieCount = void 0;
var fs = __importStar(require("fs"));
exports.identifyHighestCalorieCount = function (filePath) {
    var e_1, _a;
    //console.log('starting here')
    var flatArray = fs.readFileSync(filePath).toString().split("\n");
    // console.log('read file here')
    var elfCalories = new Map();
    var elfIndex = 0;
    var partialCount = 0;
    try {
        for (var flatArray_1 = __values(flatArray), flatArray_1_1 = flatArray_1.next(); !flatArray_1_1.done; flatArray_1_1 = flatArray_1.next()) {
            var line = flatArray_1_1.value;
            //console.log('line: ' + line)
            if (line.length === 0) {
                elfCalories.set(elfIndex, partialCount);
                console.log("elf " + elfIndex + ": " + partialCount);
                partialCount = 0;
                elfIndex++;
                continue;
            }
            var lineCalories = Number(line);
            partialCount += lineCalories;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (flatArray_1_1 && !flatArray_1_1.done && (_a = flatArray_1["return"])) _a.call(flatArray_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var largest = __spread(elfCalories.values()).sort(function (a, b) { return b - a; })[0];
    console.log("largest: " + largest);
    var threeLargest = __spread(elfCalories.values()).sort(function (a, b) { return b - a; }).slice(0, 3);
    console.log('three largest');
    threeLargest.forEach(function (x) { return console.log(x); });
    var threeLargestSum = threeLargest.reduce(function (accumulator, currentValue) { return accumulator + currentValue; }, 0);
    console.log('sum of three largest: ' + threeLargestSum);
    var smallest = __spread(elfCalories.values()).sort(function (a, b) { return a - b; })[0];
    console.log("smallest: " + smallest);
    return [largest, threeLargestSum];
};
