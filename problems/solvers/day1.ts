import * as fs from 'fs';

export const pt1Pt2 = (filePath: string): [number,number]=>{
    var flatArray = fs.readFileSync(filePath).toString().split("\n");

   let elfCalories: Map<number, number> = new Map<number, number>();
   let elfIndex: number = 0
   let partialCount : number = 0;
   for(let line of flatArray){
    if(line.length ===0) {
        elfCalories.set(elfIndex, partialCount);
        console.log(`elf ${elfIndex}: ${partialCount}`);
        partialCount = 0;
        elfIndex++
        continue
    }
    let lineCalories = Number(line);
    partialCount+= lineCalories;
   }

   let largest  =  [...elfCalories.values()].sort((a,b)=> b-a)[0];
   console.log(`largest: ${largest}`)
   let threeLargest = [...elfCalories.values()].sort((a,b)=> b-a).slice(0, 3);
   console.log('three largest');
   threeLargest.forEach(x=> console.log(x));
   let threeLargestSum = threeLargest.reduce((accumulator, currentValue) => accumulator + currentValue,0);
   console.log('sum of three largest: ' + threeLargestSum)
   let smallest  =  [...elfCalories.values()].sort((a,b)=> a-b)[0];
   console.log(`smallest: ${smallest}`)
   return [largest, threeLargestSum];
}