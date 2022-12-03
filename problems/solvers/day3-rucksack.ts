import * as fs from 'fs';

const prioritiesBase: string = 'abcdefghijklmnopqrstuvwxyz'

const itemPriorityMap: Map<string, number> = new Map<string, number>();

for(let i = 0; i < prioritiesBase.length; i++){ 
    itemPriorityMap.set(prioritiesBase[i], i+1)
    itemPriorityMap.set(prioritiesBase[i].toUpperCase(), (i+1)  + prioritiesBase.length)
}

//console.log(itemPriorityMap)

const returnCommonPriority = (rucksack: string): [string, number] =>{
    const halfIndex = (rucksack.length /2)
    const compartment1 = rucksack.slice(0, halfIndex)
    const compartment2 = rucksack.slice(halfIndex, rucksack.length)

    console.log('1: ' + compartment1)
    console.log('2: ' + compartment2)
    console.log('---')

    let sharedChar: string = ' '
    for (let i = 0; i < compartment1.length; i++) {
        for (let j = 0; j < compartment1.length; j++) {
            if (compartment1[i] === compartment2[j]) {
                sharedChar = compartment1[i];
                break;
            }
        }
    }

    return sharedChar != null ? [sharedChar, itemPriorityMap.get(sharedChar)?? 0]: ['none', 0]
}

const returnCommonPriorityPart2 = (rucksack: string, ruckSack2: string, ruckSack3: string): [string, number] =>{

    let sharedChar: string = ' '
    for (let i = 0; i < rucksack.length; i++) {
        for (let j = 0; j < ruckSack2.length; j++) {
            for(let k=0; k< ruckSack3.length; k++){
                if (rucksack[i] === ruckSack2[j] && rucksack[i] === ruckSack3[k]) {
                    sharedChar = rucksack[i];
                    break;
                }
            }
        }
    }

    return sharedChar != null ? [sharedChar, itemPriorityMap.get(sharedChar)?? 0]: ['none', 0]
}

export const computePrioritiesSum = (filePath: string): number =>{

    var flatArray = fs.readFileSync(filePath).toString().split("\n");
    let prioritySum: number= 0;

    let round= 0;
    for (let line of flatArray) {
        let ruckSack = returnCommonPriority(line)
        console.log(`rucksack ${round} commonItem: ` + ruckSack[0] +  `, priority ${ruckSack[1]}`)
        prioritySum += ruckSack[1];
        round++;
    }
       console.log('total priority: ' + prioritySum)
     

    return prioritySum;
}

export const computePrioritiesSumPar2 = (filePath: string): number =>{

    var flatArray = fs.readFileSync(filePath).toString().split("\n");
    let prioritySum: number= 0;

    let round= 0;
    for (let line of flatArray) {
        if(round%3===0){
            let ruckSack = returnCommonPriorityPart2(flatArray[round], flatArray[round+1], flatArray[round+2])
            console.log(`rucksack ${round} commonItem: ` + ruckSack[0] +  `, priority ${ruckSack[1]}`)
            prioritySum += ruckSack[1];
        }
        round++;
    }
       console.log('total priority: ' + prioritySum)
     

    return prioritySum;
}
