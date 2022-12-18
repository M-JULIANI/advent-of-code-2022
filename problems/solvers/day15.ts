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

    const minX = Math.min(sensorBeaconCoordinates.map(x=> x![0]).sort((a,b)=> a-b)[0], sensorBeaconCoordinates.map(x=> x![2]).sort((a,b)=> a-b)[0])
    const minY = Math.min(sensorBeaconCoordinates.map(x=> x![1]).sort((a,b)=> a-b)[0], sensorBeaconCoordinates.map(x=> x![3]).sort((a,b)=> a-b)[0])
    const maxX = Math.max(sensorBeaconCoordinates.map(x=> x![0]).sort((a,b)=> b-a)[0], sensorBeaconCoordinates.map(x=> x![2]).sort((a,b)=> b-a)[0])
    const maxY = Math.max(sensorBeaconCoordinates.map(x=> x![1]).sort((a,b)=> b-a)[0], sensorBeaconCoordinates.map(x=> x![3]).sort((a,b)=> b-a)[0])

    const getManhattan = (v1: Vec2, v2: Vec2):number=>{
        const x = Math.abs(v2.x - v1.x);
        const y = Math.abs(v2.y - v1.y);
        return x+y;
    }

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