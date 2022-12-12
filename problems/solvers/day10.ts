import * as fs from 'fs'

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
                console.log('cycle: ' + cycle + ', x: '+ x)
                sum+= (cycle * x);
            }
            continue;
        }

        for(let j = 0; j<2; j++){
            cycle++;

            if(cycles.includes(cycle)) {
                console.log('cycle: ' + cycle + ', x: '+ x)
                sum+= (cycle * x);
            }

            if(j===1) x += Number(splits[1]);
        }

    }

    console.log('cycles: ' + cycle)

    return sum;
}