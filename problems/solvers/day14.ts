import * as fs from 'fs'
import { makeMatrix } from '../../helpers/matrix';
import { Cell } from '../../objects/cell';
import { Vec2, vecToString } from '../../objects/objects';
import { map_range} from '../../helpers/mapNumbers'


const redraw = (matrix: number[][], map: Map<string, Cell>)=>{
    for(let x = 0; x< matrix.length; x++){
        for(let y= 0; y< matrix[0].length; y++){
            let vec = {x: y, y: x} as Vec2;
            let exists = map.get(vecToString(vec))
            if(exists == null) continue;
            matrix[x][y] = exists.occupied ? 1: 0;
        }
      }
      console.log(matrix);
  }

    const moveSand = (s: Cell, map: Map<string, Cell>): boolean => {

        let currentCell: Cell | null | undefined = new Cell(s.i, s.j, s.occupied);
        let lastCurrent = currentCell;
        while (true) {
            currentCell = currentCell.getMove(map)
            if (currentCell === undefined) return true; //if it went out of bounds
            if (currentCell == null) break; //if cannot move any more
            lastCurrent = currentCell;
        }

        lastCurrent!.flip();
        map.set(vecToString(lastCurrent!.pos), lastCurrent!)

        return false;
    }

    const moveSand2 = (s: Cell, map: Map<string, Cell>, maxVert: number): boolean => {

        let currentCell: Cell | null | undefined = new Cell(s.i, s.j, s.occupied);
        let lastCurrent = currentCell;
        while (true) {
            if(currentCell.pos.y === maxVert) return true; //if it got stuck
            currentCell = currentCell.getMove2(map, maxVert)
            if (currentCell === undefined) return true; //if it got stuck
            if (currentCell == null) break; //if cannot move any more
            lastCurrent = currentCell;
        }

        lastCurrent!.flip();
        map.set(vecToString(lastCurrent!.pos), lastCurrent!)

        return false;
    }

export const pt1 = (f: string)=>{

    const rockPackInput = fs.readFileSync(f, { encoding: 'utf-8' })
    .trim()
    .split("\n");

    const rockPaths = rockPackInput.map(x=> {
        const items = x.split('->');
        const pairs = items.map(y=> {
            const xy = y.split(',');
            return [Number(xy[0]), Number(xy[1])]
        })
        return pairs;
    });

    const map = new Map<string, Cell>();

    let minX = 100000;
    let maxX = 0;
    let minY = 100000;
    let maxY = 0;

    //get min/max
    rockPaths.forEach(path=>{
        for(let p = 0; p<path.length; p++){
            let xCurrent = path[p][0]
            let yCurrent = path[p][1]

            if(xCurrent< minX) minX = xCurrent;
            if(xCurrent> maxX) maxX = xCurrent;
            if(yCurrent< minY) minY = yCurrent;
            if(yCurrent> maxY) maxY = yCurrent;

            if(p === path.length-1) return;

            let xNext = path[p+1][0]
            let yNext = path[p+1][1]

            if (xNext === xCurrent) {
                let yMin = yCurrent < yNext ? yCurrent : yNext;
                let yMax = yCurrent < yNext ? yNext : yCurrent;
                for (let y = yMin; y < yMax; y++) {
                    if (yCurrent < minY) minY = yCurrent;
                    if (yCurrent > maxY) maxY = yCurrent;
                }
            }
            else{
                let xMin = xCurrent < xNext ? xCurrent : xNext;
                let xMax = xCurrent < xNext ? xNext : xCurrent;
                for (let x = xMin; x < xMax; x++) {
                    if (xCurrent < minX) minX = xCurrent;
                    if (xCurrent > maxX) maxX = xCurrent;
                }
            }
        }
    })

    let start = {x: 500, y: 0} as Vec2;
    let startCell = new Cell(start.x, start.y, false);
    map.set(vecToString(startCell.pos), startCell);
    if(start.x< minX) minX = start.x;
    if(start.x> maxX) maxX = start.x;
    if(start.y< minY) minY = start.y;
    if(start.y> maxY) maxY = start.y;

    //populate the map
    rockPaths.forEach(path=>{
         for(let p = 0; p<path.length; p++){
             let xCurrent = path[p][0]
             xCurrent = map_range(xCurrent, minX, maxX, 0, maxX - minX);
             let yCurrent = path[p][1]
             yCurrent = map_range(yCurrent, minY, maxY, 0, maxY - minY);
 
             const currentCell = new Cell(xCurrent, yCurrent, true);
             map.set(vecToString(currentCell.pos), currentCell);
 
             if(p === path.length-1) return;
 
             let xNext = path[p+1][0]
             xNext = map_range(xNext, minX, maxX, 0, maxX - minX);
             let yNext = path[p+1][1]
             yNext = map_range(yNext, minY, maxY, 0, maxY - minY);
 
             if(xNext === xCurrent){
                 let yMin = yCurrent < yNext ? yCurrent : yNext;
                 let yMax = yCurrent < yNext ? yNext : yCurrent;
                 for (let y = yMin; y < yMax; y++) {
                     const cell = new Cell(xCurrent, y, true)
                     map.set(vecToString(cell.pos), cell);
                 }
             }
             else {
                 let xMin = xCurrent < xNext ? xCurrent : xNext;
                 let xMax = xCurrent < xNext ? xNext : xCurrent;
                 for (let x = xMin; x < xMax; x++) {
                     const cell = new Cell(x, yCurrent, true)
                     map.set(vecToString(cell.pos), cell);
                 }
             }
         }
     })
    
  let matrix = makeMatrix(maxX - minX+1, maxY - minY+1, 0);

  for(let x = 0; x< matrix.length; x++){
    for(let y= 0; y< matrix[0].length; y++){
        let vec = {x: y, y: x} as Vec2;
        let exists = map.get(vecToString(vec))
        if(exists == null) {
            const cell = new Cell(y, x, false);
            map.set(vecToString(cell.pos), cell)
        }
        exists = map.get(vecToString(vec))
        matrix[x][y] = exists!.occupied ? 1: 0;
    }
  }

    start = {
        x: map_range(start.x, minX, maxX, 0, maxX - minX),
        y: map_range(start.y, minY, maxY, 0, maxY - minY)
    } as Vec2;
    startCell = new Cell(start.x, start.y, false);
   let iteration = 0;
    while (true) {
        if(moveSand(startCell, map))break;
        iteration++;
    }

redraw(matrix, map);
console.log('iteration: ' + iteration)

}

export const pt2 = (f: string)=>{

    const rockPackInput = fs.readFileSync(f, { encoding: 'utf-8' })
    .trim()
    .split("\n");

    const rockPaths = rockPackInput.map(x=> {
        const items = x.split('->');
        const pairs = items.map(y=> {
            const xy = y.split(',');
            return [Number(xy[0]), Number(xy[1])]
        })
        return pairs;
    });

    const map = new Map<string, Cell>();

    let minX = 100000;
    let maxX = 0;
    let minY = 100000;
    let maxY = 0;

    //get min/max
    rockPaths.forEach(path=>{
        for(let p = 0; p<path.length; p++){
            let xCurrent = path[p][0]
            let yCurrent = path[p][1]

            if(xCurrent< minX) minX = xCurrent;
            if(xCurrent> maxX) maxX = xCurrent;
            if(yCurrent< minY) minY = yCurrent;
            if(yCurrent> maxY) maxY = yCurrent;

            if(p === path.length-1) return;

            let xNext = path[p+1][0]
            let yNext = path[p+1][1]

            if (xNext === xCurrent) {
                let yMin = yCurrent < yNext ? yCurrent : yNext;
                let yMax = yCurrent < yNext ? yNext : yCurrent;
                for (let y = yMin; y < yMax; y++) {
                    if (yCurrent < minY) minY = yCurrent;
                    if (yCurrent > maxY) maxY = yCurrent;
                }
            }
            else{
                let xMin = xCurrent < xNext ? xCurrent : xNext;
                let xMax = xCurrent < xNext ? xNext : xCurrent;
                for (let x = xMin; x < xMax; x++) {
                    if (xCurrent < minX) minX = xCurrent;
                    if (xCurrent > maxX) maxX = xCurrent;
                }
            }
        }
    })

    let start = {x: 500, y: 0} as Vec2;
    let startCell = new Cell(start.x, start.y, false);
    map.set(vecToString(startCell.pos), startCell);
    if(start.x< minX) minX = start.x;
    if(start.x> maxX) maxX = start.x;
    if(start.y< minY) minY = start.y;
    if(start.y> maxY) maxY = start.y;

    maxY +=2;

    //populate the map
    rockPaths.forEach(path=>{
         for(let p = 0; p<path.length; p++){
             let xCurrent = path[p][0]
             xCurrent = map_range(xCurrent, minX, maxX, 0, maxX - minX);
             let yCurrent = path[p][1]
             yCurrent = map_range(yCurrent, minY, maxY, 0, maxY - minY);
 
             const currentCell = new Cell(xCurrent, yCurrent, true);
             map.set(vecToString(currentCell.pos), currentCell);
 
             if(p === path.length-1) return;
 
             let xNext = path[p+1][0]
             xNext = map_range(xNext, minX, maxX, 0, maxX - minX);
             let yNext = path[p+1][1]
             yNext = map_range(yNext, minY, maxY, 0, maxY - minY);
 
             if(xNext === xCurrent){
                 let yMin = yCurrent < yNext ? yCurrent : yNext;
                 let yMax = yCurrent < yNext ? yNext : yCurrent;
                 for (let y = yMin; y < yMax; y++) {
                     const cell = new Cell(xCurrent, y, true)
                     map.set(vecToString(cell.pos), cell);
                 }
             }
             else {
                 let xMin = xCurrent < xNext ? xCurrent : xNext;
                 let xMax = xCurrent < xNext ? xNext : xCurrent;
                 for (let x = xMin; x < xMax; x++) {
                     const cell = new Cell(x, yCurrent, true)
                     map.set(vecToString(cell.pos), cell);
                 }
             }
         }
     })

     const ySpread = maxY-minY;
     const xSpread = maxX - minX;
     for(let y = 0; y< ySpread+1; y++){
        for(let x= 0; x< xSpread+1; x++){
            if(y === ySpread){
            const cell = new Cell(x, y, true)
            map.set(vecToString(cell.pos), cell);
            }
        }
    }
    
  let matrix = makeMatrix(xSpread+1, ySpread+1, 0);

  for(let x = 0; x< matrix.length; x++){
    for(let y= 0; y< matrix[0].length; y++){
        let vec = {x: y, y: x} as Vec2;
        let exists = map.get(vecToString(vec))
        if(exists == null) {
            const cell = new Cell(y, x, false);
            map.set(vecToString(cell.pos), cell)
        }
        exists = map.get(vecToString(vec))
        matrix[x][y] = exists!.occupied ? 1: 0;
    }
  }

    start = {
        x: map_range(start.x, minX, maxX, 0, maxX - minX),
        y: map_range(start.y, minY, maxY, 0, maxY - minY)
    } as Vec2;
    startCell = new Cell(start.x, start.y, false);
   let iteration = 0;
    while (true) {
        if(moveSand2(startCell, map, maxY+2))break;
        iteration++;
    }

redraw(matrix, map);
console.log('iteration: ' + (iteration+1))

}