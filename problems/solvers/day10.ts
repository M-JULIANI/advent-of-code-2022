import * as fs from 'fs'
import { formatNumberMatrix } from '../../helpers/formatters';
import { makeMatrix } from '../../helpers/matrix';

const cycles = [20, 60, 100, 140, 180, 220]
export const pt1 = (f: string)=>{

let cycle = 0;
let x = 1;
let sum = 0;
    var lines = fs.readFileSync(f).toString().split("\n");

    for(let i =0; i< lines.length; i++){
        const splits = lines[i].split(' ');
        if(splits.length===1) {
            cycle++
            if(cycles.includes(cycle)) {
                sum+= (cycle * x);
            }
            continue;
        }

        for(let j = 0; j<2; j++){
            cycle++;

            if(cycles.includes(cycle)) {
                sum+= (cycle * x);
            }

            if(j===1) x += Number(splits[1]);
        }

    }
    return sum;
}

export const pt2 = (f: string)=>{

    let cycle = 0;
    let x = 1;
    const canvasWidth = 40;
    var lines = fs.readFileSync(f).toString().split("\n");
    let string = ''
    let totalArray: string[][] = []
    let pixel = 0;

    let visibleIndeces = [0,1,2]
        for(let i =0; i< lines.length; i++){
            const splits = lines[i].split(' ');
            if(splits.length===1) {
                cycle++
                pixel = (cycle)% canvasWidth;
                
                if (visibleIndeces.includes(pixel)) string += '#'
                else string += '.'

                if((string.length) % canvasWidth=== 0) {
                    totalArray.push([string])
                    string = ''
                }
               
                continue;
            }

            for (let j = 0; j < 2; j++) {
                cycle++;
                pixel = (cycle)% canvasWidth;
            
                if (visibleIndeces.includes(pixel))string += '#'
                else string += '.'

                if ((string.length)% canvasWidth ===0) {
                    totalArray.push([string])
                    string = ''
                }

                if (j === 1) {
                    const move = Number(splits[1]);
                    x += move
                }
            }
            visibleIndeces =[x, x+1, x+2];
        }
        console.log(totalArray)
        return totalArray;
    }