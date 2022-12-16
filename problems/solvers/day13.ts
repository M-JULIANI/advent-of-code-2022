import * as fs from 'fs'


const checkOrderPair = (left: Array<number> | number, right: Array<Number> | number, validOrder: {valid: boolean | null}) => {
    const leftIsNumber = typeof left === 'number';
    const rightIsNumber = typeof right === 'number';

    //if they are both numbers
    if (leftIsNumber && rightIsNumber) {
        if (left > right) {
            validOrder.valid = false;
           // console.log('false: left larger')
            return;
        }
        if (left < right) {
            validOrder.valid = true;
           // console.log('true: left smaller')
            return;
        }
    }
    //if they are both arrays
    else if (!leftIsNumber && !rightIsNumber) {
        const leftArray = left as number[];
        const rightArray = right as number[];

        let index = 0;
        //iterate
        while (true) {
            if (index > left.length - 1 && index <= right.length - 1) {
                validOrder.valid = true; // left ran out 
                return;
            } else if (index <= left.length - 1 && index > right.length - 1) {
                validOrder.valid  = false; // right ran out
                return;
            } else if (index > left.length - 1 && index > right.length - 1) {
                return;// no decision, both ran out
            }

            checkOrderPair(leftArray[index], rightArray[index], validOrder);
            if (validOrder.valid !== null) return;
            index++;
        }
    }
    //if one is a number, one is an array
    else {
        if (leftIsNumber) {
            checkOrderPair([left], right, validOrder);
        }
        else checkOrderPair(left, [right as number], validOrder);
    }
}

export const pt1 = (f: string)=> {

    const groups = fs.readFileSync(f, { encoding: 'utf-8' })
        .replace(/\r/g, "")
        .trim()
        .split("\n\n");

    const pairs = groups.map(x => {
        const [left, right] = x.split('\n').map((line) => JSON.parse(line));
        return {
            left, right
        }
    })

    let indeces = [];   
    for (let i = 0; i < pairs.length; i++) {
        let isValid = { valid: null };
        checkOrderPair(pairs[i].left, pairs[i].right, isValid)
        console.log(`pair: ${i + 1}, ${isValid.valid}`)
        if (isValid.valid) indeces.push(i + 1)
    }
    let sum = indeces.reduce((agg, current)=> agg + current, 0);
    console.log(`sum is ${sum}`)
}

export const pt2 = (f: string)=> {

    const groups = fs.readFileSync(f, { encoding: 'utf-8' })
        .replace(/\r/g, "")
        .trim();

    const pairs = groups
        .replace(/\n\n/g, '\n')
        .split('\n')
        .map((line) => JSON.parse(line))
        .concat([[[2]], [[6]]]);

    console.log(pairs)
    let sorted = pairs.sort((a,b)=>{
        let isValid = {valid: null};
        checkOrderPair(a, b, isValid);
        return  isValid.valid ? -1: 1;
    });

    console.log('sorted')
    console.log(sorted)

    let strings = sorted.map(x=> JSON.stringify(x));

    let index1 = strings.indexOf('[[2]]') + 1;
    let index2 = strings.indexOf('[[6]]') + 1;
    let product = index1 * index2;
    console.log(`product is ${product}`)
}