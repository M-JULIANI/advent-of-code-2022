import * as fs from 'fs'
import { Vec2 } from '../../objects/objects';


const getManhattan = (v1: Vec2, v2: Vec2):number=>{
    const x = Math.abs(v2.x - v1.x);
    const y = Math.abs(v2.y - v1.y);
    return x+y;
}
export const pt1 = (f: string)=>{
    const lines = fs.readFileSync(f, { encoding: 'utf-8' })
    .trim()
    .split("\n");
   
    const sensorBeaconCoordinates = lines.map(x=> {
        const items = x.match(/-?\d+/g)?.map(x=> Number(x))
        return items;
    });

   let cannotContainBeacons = new Set<number>();

    let yCompare = 2000000;

    sensorBeaconCoordinates.forEach(x => {
        //sensor
        const uX = x![0]
        const uY = x![1];
        const sensor = { x: uX, y: uY } as Vec2;
        //beacon
        const uX2 = x![2];
        const uY2 = x![3];
        const beacon = { x: uX2, y: uY2 } as Vec2;
        const dist = getManhattan(sensor, beacon)

        const minDist = getManhattan(sensor, { x: sensor.x, y: yCompare } as Vec2)
        if (minDist <= dist) {
            const distAroundX = dist - minDist;
            for (let d = sensor.x - distAroundX; d < sensor.x + distAroundX; d++) {
                cannotContainBeacons.add(d);
            }
        }
        
    })

    console.log('number accross: ' + (cannotContainBeacons.size))
}

export const pt2 = (f: string)=>{
    const lines = fs.readFileSync(f, { encoding: 'utf-8' })
    .trim()
    .split("\n");
   
    const sensorBeaconCoordinates = lines.map(x=> {
        const items = x.match(/-?\d+/g)?.map(x=> Number(x))
        return items;
    });

    let yCompare = 4000000;
   // let yCompare = 20;

    const sensorData: [Vec2, Vec2, number][] = sensorBeaconCoordinates.map(x => {
        //sensor
        const uX = x![0]
        const uY = x![1];
        const sensor = { x: uX, y: uY } as Vec2;
        //beacon
        const uX2 = x![2];
        const uY2 = x![3];
        const beacon = { x: uX2, y: uY2 } as Vec2;
        const dist = getManhattan(sensor, beacon)
        return [sensor, beacon, dist];
    })

    for(let y =0; y< yCompare; y++){
        const intervals: [number, number][]= [];

        for(let s = 0; s< sensorData.length; s++){
            const minDist = getManhattan(sensorData[s][0], {x: sensorData[s][0].x, y: y})
            if(minDist<= sensorData[s][2]){
                const distAround = sensorData[s][2] - minDist;
                let from = sensorData[s][0].x - distAround;
                let to = sensorData[s][0].x + distAround
                intervals.push([from, to])
            }
        }

        intervals.sort((a, b) => a[0] - b[0]);
        for (let i = 1; i < intervals.length; i++) {
          if (intervals[i - 1][1] >= intervals[i][0]) {
            // merge overlapping intervals
            intervals[i - 1][1] = Math.max(intervals[i - 1][1], intervals[i][1]);
            intervals.splice(i, 1);
            i--;
          }
        }

        const result = [];
        for(let interval of intervals){
            if(interval[0] > yCompare || 0 > interval[1]){
                continue;
            }

            result.push([
                Math.max(interval[0], 0),
                Math.min(interval[1], yCompare)
            ])

            if(result.length>1){
                const x = result[0][1] + 1;
                console.log(x * 4e6 + y)
                return;
            }
        }

    }
}