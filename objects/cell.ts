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
            const neighborInMap = map.get(vecToString(possibleNeighbor))
            if(neighborInMap == null ) return undefined;
            if(neighborInMap.occupied) continue;

            return neighborInMap
        }

        return null;
    }

    getMove2(map: Map<string, Cell>, maxHeight: number): Cell | null | undefined{

        const left = [-1, 1];
        const bottom = [0, 1];
        const right = [1, 1];

        const movement = [bottom, left, right];

        let allNeighborsInFirstRow = 0;
        let allThreeOcupied = 0;
        for(let i =0; i<3; i++){
            const possibleNeighbor = {x: this.pos.x + movement[i][0], y: this.pos.y + movement[i][1]} as Vec2
            if(possibleNeighbor.y ===1) allNeighborsInFirstRow++;
            const neighborInMap = map.get(vecToString(possibleNeighbor))
            if(neighborInMap !=null){
                if(neighborInMap.occupied) allThreeOcupied++;
            }
        }
        if(allNeighborsInFirstRow && allThreeOcupied ===3) return undefined; //return if stuck at the beginning

        //otherwise proceed as normal
        for(let i =0; i<3; i++){
            const possibleNeighbor = {x: this.pos.x + movement[i][0], y: this.pos.y + movement[i][1]} as Vec2
            const neighborInMap = map.get(vecToString(possibleNeighbor))
            //if null, add to map, and continue, unless new cell is unoccupied, else return it
            if(neighborInMap == null){
                const occupied = possibleNeighbor.y === maxHeight-2 ? true : false;
                const newCell = new Cell(possibleNeighbor.x, possibleNeighbor.y, occupied)
                map.set(vecToString(newCell.pos), newCell);
                if(!occupied) return newCell;
                continue;
            }
            if(neighborInMap!.occupied) continue;
            return neighborInMap;
        }

        return null;
    }

}