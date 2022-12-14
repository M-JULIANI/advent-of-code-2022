import * as fs from 'fs';

const InstrumentValue = {
    'Rock': 1,
    'Paper': 2,
    'Scissor': 3
}

const InstrumentToValue: Record<string, number> = {
    'A': InstrumentValue.Rock,
    'B': InstrumentValue.Paper,
    'C': InstrumentValue.Scissor,
}
const MyInstrumentToValue: Record<string, number> = {
    'X': InstrumentValue.Rock,
    'Y': InstrumentValue.Paper,
    'Z': InstrumentValue.Scissor,
}

const Outcomes: Record<string, number> = {
    'X': 0, //loss
    'Y': 3, //tie
    'Z': 6, //win
}

const computeRound = (roundInfo: string, myInstrument: number | null = null): [number, string, string] => {
    const round = roundInfo.split(' ')
    const opponentInstrumentValue = InstrumentToValue[round[0]]
    const myInstrumentValue = myInstrument != null? myInstrument : MyInstrumentToValue[round[1]]
    const rockAndScissorsInvolved = opponentInstrumentValue + myInstrumentValue ===4 && opponentInstrumentValue != myInstrumentValue;
    let partialScore: number = 0;

    if(rockAndScissorsInvolved){
        //0 if lost, 6 if win
        partialScore = myInstrumentValue > opponentInstrumentValue ? 0 : 6
    }
    else if(myInstrumentValue === opponentInstrumentValue) partialScore = 3
    else partialScore = myInstrumentValue > opponentInstrumentValue ? 6 : 0

    return [partialScore + myInstrumentValue, round[1], round[0]]
}


//part 1
export const pt1 = (filePath: string): number => {

    var flatArray = fs.readFileSync(filePath).toString().split("\n");
    let totalscore: number= 0;

    let round= 0;
    for (let line of flatArray) {
        let roundScore = computeRound(line)
        totalscore += roundScore[0];
        round++;
    }
       console.log('TOTALSCORE: ' + totalscore)
     

    return totalscore;
}

const computeRequiredInstrumentToAchieveOutcome = (roundInfo: string):number => {
    const round = roundInfo.split(' ')
    const opponentInstrumentValue = InstrumentToValue[round[0]]
    const desiredOutcome = Outcomes[round[1]]
    let opponentValueIndex0 = opponentInstrumentValue - 1
    let myInstrumentValue: number = 0
    
    //loss
    if(desiredOutcome === 0){
       myInstrumentValue = opponentValueIndex0 === 0 ? 2 : opponentValueIndex0 -1
    }
    //tie
    else if (desiredOutcome === 3)
    {
        myInstrumentValue = opponentValueIndex0
    }
    else if(desiredOutcome === 6){
        myInstrumentValue = (opponentValueIndex0+ 1 + 3) % 3
    }

    myInstrumentValue +=1;
    return myInstrumentValue
}

//part 2
export const pt2 = (filePath: string): number => {

    var flatArray = fs.readFileSync(filePath).toString().split("\n");
    let totalscore: number= 0;

    let round= 0;
    for (let line of flatArray) {
        let requiredInstrument = computeRequiredInstrumentToAchieveOutcome(line)
        let roundScore = computeRound(line, requiredInstrument);
        totalscore += roundScore[0];
        round++;
    }
       console.log('TOTALSCORE: ' + totalscore)
    return totalscore;
}