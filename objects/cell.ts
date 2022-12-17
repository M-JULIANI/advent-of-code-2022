import { Vec2, vecToInt, vecToString } from "./objects";

export class Cell{

    i: number;
    j: number;

    pos: Vec2;

    occupied: boolean = false;

    constructor(i: number, j: number, occupied: boolean){
        this.i = i;
        this.j = j;
        this.pos = {x: i, y: j} as Vec2;
        this.occupied = occupied;
    }

    flip(){
        this.occupied = !this.occupied;
    }

    getMove(map: Map<string, Cell>): Cell | null | undefined{

        const left = [-1, 1];
        const bottom = [0, 1];
        const right = [1, 1];

        const movement = [bottom, left, right];

        for(let i =0; i<3; i++){
            const possibleNeighbor = {x: this.pos.x + movement[i][0], y: this.pos.y + movement[i][1]} as Vec2
           //  console.log(possibleNeighbor)
            const neighborInMap = map.get(vecToString(possibleNeighbor))
          //  console.log(neighborInMap)
            if(neighborInMap == null ) return undefined;
            if(neighborInMap.occupied) continue;

            return neighborInMap
        }

        return null;
    }

}