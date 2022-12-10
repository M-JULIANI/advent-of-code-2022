
import * as fs from 'fs'
import { formatStringMatrix } from '../../helpers/formatters';
import { makeMatrix } from '../../helpers/matrix';

type Point = [number, number];


export const pt1 = (f: string) => {
    var lines = fs.readFileSync(f).toString().split("\n");

    let visited: Map<string, Point> = new Map<string, Point>();
    let stateHead: Point = [0,0]

    const isWithinOneCell = (c: Point, o: Point): boolean =>{
        for(let i = -1; i<=1; i++){
            for(let j = -1; j<=1; j++){
                const currentX = c[0];
                const currentY = c[1];
                const samplePt = [currentX+i,currentY+j] as Point
                if(samplePt[0] === o[0] && samplePt[1] === o[1]) return true;
            }
        }

        return false;
    }
    const headMove = (instruction: string, startPt: Point, startPtTail:Point): [Point, Point] =>{
        const split = instruction.split(' ')
        let dir = split[0];
        let quantity = Number(split[1])

        let lastPtHead = stateHead;
        let usableHead = startPt;
        let usableTail= startPtTail;

        for (let d = 1; d <= quantity; d++) {
            let interval = 1;
            if (dir === 'D' || dir === 'L') interval *= -1;

            let newPoint: Point = [0, 0] as Point;
            switch (dir) {
                case 'R':
                    newPoint = [usableHead[0] + interval, usableHead[1]] as Point;
                    break;
                case 'L':
                    newPoint = [usableHead[0] + interval, usableHead[1]] as Point;
                    break;
                case 'U':
                    newPoint = [usableHead[0], usableHead[1] + interval] as Point;
                    break;
                case 'D':
                    newPoint = [usableHead[0], usableHead[1] + interval] as Point;
                    break;
            }

            lastPtHead = usableHead;
            usableHead = newPoint;

            if (!isWithinOneCell(usableTail, usableHead)) {
                usableTail = lastPtHead;
                if (!visited.has(usableTail.toString())) {
                    visited.set(usableTail.toString(), usableTail);
                }
            }
        } 

        return [usableHead, usableTail];
     }

     let lastH = [0,0] as Point;
     let lastT = [0,0] as Point;
     if (!visited.has(lastT.toString())) {
        visited.set(lastT.toString(), lastT);
    }
    for(let i = 0; i< lines.length; i++){
        let [lastPtHead, lastPtTail]= headMove(lines[i], lastH, lastT);
        lastH = lastPtHead;
        lastT = lastPtTail;
    }

    let counter = 0;

    // let m = makeMatrix(1000, 1000, 0);

    visited.forEach((key, value) => {
    let x = key[0]+500;
    let y = key[1] + 500
    // m[x][y] = 1
   console.log('pt: '+ key)
    console.log(key, value);
    counter++;});
    // console.log(formatMatrix(m))
    console.log('visited locations: ' + `${counter}`);

}