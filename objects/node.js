"use strict";
exports.__esModule = true;
exports.Node = void 0;
var Node = /** @class */ (function () {
    function Node(i, j, height) {
        this.gcost = 1; //cost current node to this node
        this.hcost = 1; //cost from node to target
        this.fcost = this.gcost + this.hcost; //sum of g and h costs
        this.parent = {};
        this.visited = false;
        this.dist = Infinity;
        this.i = i;
        this.j = j;
        this.height = height;
        this.pos = { x: i, y: j };
    }
    Node.prototype.canMoveTo = function (s, n) {
        return n.height <= s.height + 1;
        //return (Math.abs(n.height - s.height) <= 1);
    };
    Node.prototype.canMoveTo2 = function (s, n) {
        // return (Math.abs(n.height - s.height) <= 1)
        return (s.height - 1) <= n.height;
        //return true;
    };
    Node.prototype.setParent = function (p) {
        this.parent = p;
    };
    return Node;
}());
exports.Node = Node;
