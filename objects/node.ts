import { Vec2 } from "./objects";
export class Node{

    i: number;
    j: number;

    pos: Vec2;

    gcost: number =1; //cost current node to this node

    hcost: number = 1; //cost from node to target
   
    fcost: number = this.gcost + this.hcost //sum of g and h costs

    parent: Node = {} as Node;

    height: number;

    visited: boolean = false;
    dist = Infinity;

    constructor(i: number, j: number, height: number){
        this.i = i;
        this.j = j;
        this.height = height;
        this.pos = {x: i, y:j};
    }

    canMoveTo(s: Node, n: Node){
       return n.height <= s.height + 1;
        //return (Math.abs(n.height - s.height) <= 1);
    }

    canMoveTo2(s: Node, n: Node){
       // return (Math.abs(n.height - s.height) <= 1)
        return (s.height-1)<= n.height;
        //return true;
     }

    setParent(p: Node){
        this.parent = p;
    }
}