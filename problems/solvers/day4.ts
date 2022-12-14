import * as fs from 'fs';


export const pt1 = (filePath: string) =>{
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

        if(range1Min >= range2Min && range1Max<=range2Max) count++;
        else if(range1Min <=range2Min && range1Max>=range2Max) count++;
    }

    console.log('fully contained count: '  + count)

}

export const pt2 = (filePath: string) =>{
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

        if(range1Min <= range2Min&& range1Max<=range2Max && range1Max>= range2Min) count++;
        else if(range2Min <= range1Min&& range2Max<=range1Max  && range2Max>= range1Min) count++;
        else if(range1Min >= range2Min && range1Max<=range2Max) count++;
        else if(range1Min <=range2Min && range1Max>=range2Max) count++;
    }

    console.log('overlap count: '  + count)

}