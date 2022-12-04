import * as fs from 'fs';
import { stringify } from 'querystring';


export const getRangeCountOfFullyContainedRanges = (filePath: string) =>{
    var allPairs = fs.readFileSync(filePath).toString().split("\n");

    let count = 0;
    for(let i=0; i < allPairs.length; i++){
        let splitPairs = allPairs[i].split(',');
        let range1Text = splitPairs[0];
        let numericalRange1 = range1Text.split('-')
        let range1Min = Number(numericalRange1[0])
        let range1Max = Number(numericalRange1[1])

        let range2Text = splitPairs[1];
        let numericalRange2 = range2Text.split('-')
        let range2Min = Number(numericalRange2[0])
        let range2Max = Number(numericalRange2[1])

        if(range1Min >= range2Min && range1Max<=range2Max) {
            count++;
            console.log('CONTAINED')
        }
        else if(range1Min <=range2Min && range1Max>=range2Max) {
            count++;
            console.log('CONTAINED')
        }

        console.log('round ' + i + ', range1: ' + range1Text + ', ' + 'range2: '+ range2Text)
    }

    console.log('fully contained count: '  + count)

}

export const getRangeAnyOverlap = (filePath: string) =>{
    var allPairs = fs.readFileSync(filePath).toString().split("\n");

    let count = 0;
    for(let i=0; i < allPairs.length; i++){
        let splitPairs = allPairs[i].split(',');
        let range1Text = splitPairs[0];
        let numericalRange1 = range1Text.split('-')
        let range1Min = Number(numericalRange1[0])
        let range1Max = Number(numericalRange1[1])

        let range2Text = splitPairs[1];
        let numericalRange2 = range2Text.split('-')
        let range2Min = Number(numericalRange2[0])
        let range2Max = Number(numericalRange2[1])

        if(range1Min <= range2Min&& range1Max<=range2Max && range1Max>= range2Min) {
            count++;
            console.log('round ' + i + ', range1: ' + range1Text + ', ' + 'range2: '+ range2Text + ', OVERLAPS')
        }
        else if(range2Min <= range1Min&& range2Max<=range1Max  && range2Max>= range1Min) {
            count++;
            console.log('round ' + i + ', range1: ' + range1Text + ', ' + 'range2: '+ range2Text + ', OVERLAPS')
        }
        else if(range1Min >= range2Min && range1Max<=range2Max) {
            count++;
            console.log('round ' + i + ', range1: ' + range1Text + ', ' + 'range2: '+ range2Text + ', CONTAINED')
        }
        else if(range1Min <=range2Min && range1Max>=range2Max) {
            count++;
            console.log('round ' + i + ', range1: ' + range1Text + ', ' + 'range2: '+ range2Text + ', CONTAINED')
        }
        else  console.log('round ' + i + ', range1: ' + range1Text + ', ' + 'range2: '+ range2Text)



    }

    console.log('overlap count: '  + count)

}