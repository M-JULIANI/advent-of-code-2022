import * as fs from 'fs'
import { makeMatrix } from '../../helpers/matrix';
import { Cell } from '../../objects/cell';
import { Vec2, vecToString } from '../../objects/objects';
import { map_range} from '../../helpers/mapNumbers'



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

            if(xNext === xCurrent){
                for(let y = yCurrent; y<yNext; y++){
                    if(yCurrent< minY) minY = yCurrent;
                    if(yCurrent> maxY) maxY = yCurrent;
                }
            }
            else{
                for(let x = xCurrent; x>xNext; x--){
                        if(xCurrent< minX) minX = xCurrent;
                        if(xCurrent> maxX) maxX = xCurrent;
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
            // console.log('current: ' + currentCell.pos)
 
             if(p === path.length-1) return;
 
             let xNext = path[p+1][0]
             xNext = map_range(xNext, minX, maxX, 0, maxX - minX);
             let yNext = path[p+1][1]
             yNext = map_range(yNext, minY, maxY, 0, maxY - minY);
 
             if(xNext === xCurrent){
                 for(let y = yCurrent; y<yNext; y++){
                     const cell = new Cell(xCurrent, y, true)
                     map.set(vecToString(cell.pos), cell);
                 }
             }
             else{
                 for(let x = xCurrent; x>xNext; x--){
                         const cell = new Cell(x, yCurrent, true)
                         map.set(vecToString(cell.pos), cell);
                 }
             }
         }
     })

    //console.log(map)
  //  console.log('remapped: ')
    
  //  const rexmin = map_range(minX, minX, maxX, maxX - minX,)
  let matrix = makeMatrix(maxX - minX+1, maxY - minY+1, 0);
//   console.log(maxX-minX, maxY - minY)

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
           // console.log('current cell')
           // console.log('updated')
            //console.log(currentCell)
            if(currentCell === undefined) return true; //if it went out of bounds
            if (currentCell == null) break; //if cannot move any more
            // console.log('current cell')
            // console.log(currentCell.pos)
            lastCurrent = currentCell;
        }

        lastCurrent!.flip();
        map.set(vecToString(lastCurrent!.pos), lastCurrent!)

        return false;
    }

    start = {
        x: map_range(start.x, minX, maxX, 0, maxX - minX),
        y: map_range(start.y, minY, maxY, 0, maxY - minY)
    } as Vec2;
    startCell = new Cell(start.x, start.y, false);

   //console.log('start')
   //console.log(startCell.pos)

   let iteration = 0;
    while (true) {
        if(moveSand(startCell, map))break;
        iteration++;
    }

//console.log(matrix);
redraw(matrix, map);
console.log('iteration: ' + iteration)




   // console.log(rockPaths)

}