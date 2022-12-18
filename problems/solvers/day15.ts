import * as fs from 'fs'
import { makeMatrix } from '../../helpers/matrix';
import { Cell } from '../../objects/cell';
import { Vec2, vecToString } from '../../objects/objects';
import { map_range} from '../../helpers/mapNumbers'
import { formatNumberMatrix } from '../../helpers/formatters';

export const pt1 = (f: string)=>{
    const lines = fs.readFileSync(f, { encoding: 'utf-8' })
    .trim()
    .split("\n");
   
    const sensorBeaconCoordinates = lines.map(x=> {
        const items = x.match(/-?\d+/g)?.map(x=> Number(x))
        return items;
    });

    let minX = Math.min(sensorBeaconCoordinates.map(x=> x![0]).sort((a,b)=> a-b)[0], sensorBeaconCoordinates.map(x=> x![2]).sort((a,b)=> a-b)[0])
    let minY = Math.min(sensorBeaconCoordinates.map(x=> x![1]).sort((a,b)=> a-b)[0], sensorBeaconCoordinates.map(x=> x![3]).sort((a,b)=> a-b)[0])
    let maxX = Math.max(sensorBeaconCoordinates.map(x=> x![0]).sort((a,b)=> b-a)[0], sensorBeaconCoordinates.map(x=> x![2]).sort((a,b)=> b-a)[0])
    let maxY = Math.max(sensorBeaconCoordinates.map(x=> x![1]).sort((a,b)=> b-a)[0], sensorBeaconCoordinates.map(x=> x![3]).sort((a,b)=> b-a)[0])

    console.log([minX, minY, maxX, maxY])

    let map = new Map<string, Cell>();

    let sensorStore = [] as Vec2[][];
    sensorBeaconCoordinates.forEach(x=>{
        const uX = map_range(x![0], minX, maxX, 0, Math.abs(maxX - minX));
        const uY = map_range(x![1], minY, maxY, 0, Math.abs(maxY - minY));
        const cell = new Cell(uX, uY, true);
        cell.setType(7)
        map.set(vecToString(cell.pos), cell)
        const uX2 = map_range(x![2], minX, maxX, 0, Math.abs(maxX - minX));
        const uY2 = map_range(x![3], minY, maxY, 0, Math.abs(maxY - minY));
        const cell2 = new Cell(uX2, uY2, true);
        cell2.setType(8)
        map.set(vecToString(cell2.pos), cell2)
       // sensorStore.push([{x: x![0], y: x![1]} as Vec2, {x: x![2], y: x![3]} as Vec2])
        sensorStore.push([{x: uX, y: uY} as Vec2, {x: uX2, y: uY2} as Vec2])
    })

    console.log(map)

  

    const totalY = Math.abs(maxY - minY)+1;
    const totalX = Math.abs(maxX - minX)+1;

    const getManhattan = (v1: Vec2, v2: Vec2):[number, number, number]=>{
        const x = Math.abs(v2.x - v1.x);
        const y = Math.abs(v2.y - v1.y);
        return[x+y, x, y];
    }

    let matrix = makeMatrix(totalX+20, totalY+20, 0);

    for(let i =0; i< sensorStore.length; i++){
        let parent = sensorStore[i][0];
        let child = sensorStore[i][1];
       // console.log(parent)
        // console.log(child)
        const manhattan = getManhattan(parent, child)
        const parentCell = map.get(vecToString(parent));
       // console.log([manhattan[1], manhattan[2]])
       // console.log('-')
        if(parentCell!==undefined){
            parentCell.markMapAsOccupied(map, manhattan[0])
        }
        console.log(manhattan)

    }

  //  console.log(map)
    for(let y = 0; y< totalY; y++){
        for(let x = 0; x< totalX;  x++){
            const vec = {x: y, y: x} as Vec2;
          //  console.log(vec)
            let mapped = map.get(vecToString(vec))
            if (mapped != null) {
                matrix[x][y] = mapped!.type;
            }
        }
    }

    let c8 = 0;
    let c9 = 0;
    let c10 = 0;
    let c11 = 0;
    let c12 = 0;
    map.forEach((cell: Cell, key: string) => {
        if(cell!= null){
           // console.log(cell)
            if(cell.i === 8){
                if(cell.type ===1){
                    c8++;
                }
            }
            if(cell.i === 9){
                if(cell.type ===1){
                    c9++;
                }
            }
            if(cell.i === 10){
                if(cell.type ===1){
                    c10++;
                }
            }
            if(cell.i=== 11){
                if(cell.type ===1){
                    c11++;
                }
            }
            if(cell.i === 12){
                if(cell.type ===1){
                    c12++;
                }
            }
        }
    });

    console.log([c8, c9, c10, c11, c12])

   console.log(formatNumberMatrix(matrix))
}