import * as fs from 'fs'
import { formatStringMatrix } from '../../helpers/formatters';
import { makeMatrix } from '../../helpers/matrix';

export const pt1 = (f: string) =>{
    var lines = fs.readFileSync(f).toString().split("\n");

    let data: string[][] = makeMatrix(lines.length, lines[0].length, '0');
    let formattedInput: string[][] = makeMatrix(lines.length, lines[0].length, '0');
    let count =0 ;
    for (let i = 0; i < lines[0].length; i++) {
        for (let j = 0; j < lines.length; j++) {
            const item = Number(lines[i][j]);
            data[i][j]=lines[i][j];
            formattedInput[i][j] = lines[i][j];

            if(i === 0 || j ===0 || i === lines.length-1 || j === lines[0].length-1){
                count++;
                data[i][j] = 'V';
                continue;
            }
            let clears1 = true;
            let clears2 = true;
            let clears3 = true;
            let clears4 = true;

                for (let k = 0; k < i; k++) {
                    if (item <= Number(lines[k][j])) {
                        clears1 = false;
                        break;
                    }
                }

                for(let k=i+1; k< lines.length; k++){
                    if(item<= Number(lines[k][j])) {
                        clears2 = false;
                        break;
                    }
                }

                for(let k=0; k< j; k++){
                    if(item<= Number(lines[i][k])) {
                        clears3 = false;
                        break;
                    }
                }

                for(let k=j+1; k< lines[0].length; k++){
                    if(item<=Number(lines[i][k])) {
                        clears4 = false;
                        break;
                    }
                }

                if(clears1 || clears2 || clears3 || clears4) {
                    count++;
                    data[i][j] = 'V'
                }
        }
    }
const formatted = formatStringMatrix(data);
const formattedIn = formatStringMatrix(formattedInput);
    fs.writeFile('sampleOut.txt', formatted, 'utf8', ()=>{})
    fs.writeFile('inputFormatted.txt', formattedIn, 'utf8', ()=>{})
    
console.log('answer: ' + count)
}

export const pt2 = (f: string) =>{
    var lines = fs.readFileSync(f).toString().split("\n");

    let data: string[][] = makeMatrix(lines.length, lines[0].length, '0');
    let formattedInput: string[][] = makeMatrix(lines.length, lines[0].length, '0');
    let count =0;
    let max = 0;
    for (let i = 0; i < lines[0].length; i++) {
        for (let j = 0; j < lines.length; j++) {
            const item = Number(lines[i][j]);
            data[i][j]=lines[i][j];
            formattedInput[i][j] = lines[i][j];

            let count1 = 0;
            let count2= 0;
            let count3 = 0;
            let count4 = 0;

                for (let k = 0; k < i; k++) {
                    if (item <= Number(lines[k][j])) {
                        count1 = i-k;
                        count1 = count1===0? 1 : count1;
                        break;
                    }
                    count1 = i-k;
                 //   count1 = count1===0? 1 : count1;
                }

                for(let k=i+1; k< lines.length; k++){
                    if(item<= Number(lines[k][j])) {
                        count2 = k-i;
                        count2 = count2===0? 1 : count2;
                        break;
                    }
                    count2 = k-i;
                 //   count2 = count2===0? 1 : count2;
                }

                for(let k=0; k< j; k++){
                    if(item<= Number(lines[i][k])) {
                        count3 = j-k;
                        count3 = count3===0? 1 : count3;
                        break;
                    }
                    count3 = j-k;
                  // count3 = count3===0? 1 : count3;
                }

                for(let k=j+1; k< lines[0].length; k++){
                    if(item<=Number(lines[i][k])) {
                        count4 = k-j;
                        count4 = count4===0? 1 : count4;
                        break;
                    }
                    count4 = k-j;
                    //count4 = count4===0? 1 : count4;
                }

                let sum = count1 * count2 * count3 * count4;
                if(sum>max){
                    max = sum;
                }
        }
    }
    console.log('max: ' + max)
const formatted = formatStringMatrix(data);
const formattedIn = formatStringMatrix(formattedInput);
    fs.writeFile('sampleOut.txt', formatted, 'utf8', ()=>{})
    fs.writeFile('inputFormatted.txt', formattedIn, 'utf8', ()=>{})
    
console.log('answer: ' + count)
}