
import * as fs from 'fs'
import { off } from 'process';
import { formatNumberMatrix, formatStringMatrix } from '../../helpers/formatters';
import { makeMatrix } from '../../helpers/matrix';

type Point = [number, number];

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

export const pt1 = (f: string) => {
    var lines = fs.readFileSync(f).toString().split("\n");

    let visited: Map<string, Point> = new Map<string, Point>();
    let stateHead: Point = [0,0]

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
    // let x = key[0]+500;
    // let y = key[1] + 500
    // m[x][y] = 1
   //console.log('pt: '+ key)
    console.log(key, value);
    counter++;});
    // console.log(formatMatrix(m))
    console.log('visited locations: ' + `${counter}`);

}

const follow = (p1: Point, p2: Point)=>{

    const dist = Math.max(Math.abs(p2[1]-p1[1]), Math.abs(p2[0]-p1[0]));

    if(Number(dist)>1){
    let x = p2[0] - p1[0];
    let y = p2[1] - p1[1];

    let updatedX = p1[0] + (Math.abs(x) ===2? x/2: x);
    let updatedY = p1[1] + (Math.abs(y) === 2? y/2 : y);
    return [updatedX, updatedY] as Point;
    }

    return p1;
}

export const pt2 = (f: string) => {
    var lines = fs.readFileSync(f).toString().split("\n");

    const ropeLength = 10;
    let visited: Map<string, Point> = new Map<string, Point>();

    const headMove = (instruction: string, startPts: Point[]): Point[] =>{
        const split = instruction.split(' ')
        let dir = split[0];
        let quantity = Number(split[1])
        let usableHead: Point = startPts[0];
        let allPts: Point[] = []
        for(let i=0; i< startPts.length; i++) allPts[i] = startPts[i]

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

            usableHead = newPoint;
            allPts[0] = usableHead;

            for(let k =1; k<ropeLength ; k++){
                let current = allPts[k];
                let prev = allPts[k-1];
                allPts[k] = follow(current, prev)

                if(k===ropeLength-1){
                    const tail = allPts[k];
                    if (!visited.has(tail.toString())) {
                        visited.set(tail.toString(), tail);
                    }
                }
            }
        } 

        return allPts;
     }

     let lastList:Point[] = []
     for(let i=0; i<ropeLength; i++){lastList[i] = [0,0] as Point;}

     if (!visited.has([0,0].toString())) visited.set([0,0].toString(), [0,0]);

    for(let i = 0; i< lines.length; i++){
        let lastPtHead= headMove(lines[i], lastList);
        lastList = lastPtHead;
    }

    let copy = new Map<string, Point>();
    for(let l of visited){
        let newPt = [l[1][0], l[1][1]] as Point;
        copy.set(newPt.toString(), newPt)
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity
    for(let l of copy){
        let x = l[1][0]
        let y = l[1][1]
        if(x>maxX)maxX = x;
        if(x<minX) minX = x;
        if(y>maxY)maxY = y;
        if(y<minY) minY = y;
       }

       console.log('minX: ' + minX)
       console.log('minY: ' + minY)
       console.log('maxX: ' + maxX)
       console.log('maxY: ' + maxY)

    const mX = Math.abs(maxX - minX)
    const mY = Math.abs(maxY - minY);
    const mat = makeMatrix(1000, 1000, 8);

    console.log(mX + ", " + mY)

    let offset = Math.max(Math.abs(minX), Math.abs(minY));;

   for(let l of copy){
    let x = l[1][0]+offset;
    let y = l[1][1]+offset;
   mat[x][y] = 1;
   }
   mat[offset][offset]=7

   let jsn = 'test.json'
   const matString =formatNumberMatrix(mat)
   fs.writeFile(jsn, matString, 'utf8', ()=>{});


    let counter = 0;
    visited.forEach((key_, _) => {counter++;});
    console.log('visited locations: ' + `${counter}`);

    return counter;
}