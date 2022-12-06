import * as fs from 'fs';

export const pt1Pt2 = (filePath: string): [number,number]=>{
    var flatArray = fs.readFileSync(filePath).toString().split("\n");

   let elfCalories: Map<number, number> = new Map<number, number>();
   let elfIndex: number = 0
   let partialCount : number = 0;
   for(let line of flatArray){
    if(line.length ===0) {
        elfCalories.set(elfIndex, partialCount);
        partialCount = 0;
        elfIndex++
        continue
    }
    let lineCalories = Number(line);
    partialCount+= lineCalories;
   }

   const largest  =  [...elfCalories.values()].sort((a,b)=> b-a)[0];
   const threeLargest = [...elfCalories.values()].sort((a,b)=> b-a).slice(0, 3);
   const threeLargestSum = threeLargest.reduce((accumulator, currentValue) => accumulator + currentValue,0);
   return [largest, threeLargestSum];
}