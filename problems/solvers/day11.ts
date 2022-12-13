import * as fs from 'fs'
 
class Monkey{

    index: number =-1;
    items: number[] = []

    func: ((f: number) => number);

    test: ((f: number) => number);
    monkeys : Monkey[] = []
    inspectCount: number = 0;

    constructor(index: number, initialItems: number[], 
        func: ((f: number) => number),
        test: ((f: number) => number)){
        this.index = index;
        this.items = initialItems.slice();
        this.func = func;
        this.test = test;
    }
    
    addItem(n: number){
        this.items.push(n);
    }

    inspect(n: number){
        return n/3;
    }

    dequee(){
        if(this.items.length <1) return;
        return this.items.shift();
    }

    operation(n: number){
        return this.func(n);
    }

    actualTest(n: number){
        return this.test(n);
    }
  
    runCycle(){
        while(this.items.length>0){
           let item =  this.dequee();
           if(item == null) break;
           this.inspectCount++;
           item = this.operation(item!);
           item = Math.floor(item/3);
           let monkeyToGiveTo = this.actualTest(item);
           this.monkeys[monkeyToGiveTo].addItem(item);
        }
    }

    
    runCycle2(lcm: number){
        while(this.items.length>0){
           let item =  this.dequee();
           if(item == null) break;
           this.inspectCount++;
           item = this.operation(item!);
           item = item %lcm; //use modulo to reduce number
           let monkeyToGiveTo = this.actualTest(item); //proceed to actual test
           this.monkeys[monkeyToGiveTo].addItem(item);
        }
    }
}

const getOperator = (s: string[], num: number) =>{

    if(s.includes('*') && s.includes('old')){
        return ((n: number)=> n * n);
    }
   else if(s.includes('*')){
    return ((n: number)=> n * num);
   }
   else if(s.includes('+')){
    return ((n: number)=> n + num);
   }

   return ((n: number)=> n + 0);
}

const processMonkeys = (lines: string[]):Monkey[]=>{

    let count = 0;
    let monkeys: Monkey[] =  [] as Monkey[];
    for(let i=0; i<lines.length; i+=7){

     //   if(i%5===0){
            var numberPattern = /\d+/g;
            const items = lines[i+1].split(':')[1].split(',').map(x=> Number(x))
            const split =  lines[i+2].split(' ')
            const number = Number(split[7]) ?? 0;
            const operatorString= split[6];
            const numberString = split[7];
            const operator = getOperator([operatorString, numberString],number);
            const divisibleBy = Number(lines[i+3].match(numberPattern));
            const trueCon = Number(lines[i+4].match(numberPattern));
            const falseCon = Number(lines[i+5].match(numberPattern));
            const test = ((n: number)=> n %divisibleBy ===0 ? trueCon : falseCon);

            const monkey = new Monkey(count, items, operator, test)
            monkeys.push(monkey);
            count++;
    }

    for(let m of monkeys){
        m.monkeys = monkeys;
    }

    return monkeys;
}

const processMonkeys2 = (lines: string[]):[Monkey[], number]=>{
    //get divisors
    let divisors = [] as number[];
    for (let i = 0; i < lines.length; i += 7) {
        var numberPattern = /\d+/g;
        const divisibleBy = Number(lines[i + 3].match(numberPattern));
        divisors.push(divisibleBy)
    }
    //product
    let commonProduct = divisors.reduce((accumulator, currentValue) => accumulator * currentValue, 1);

    let count = 0;
    let monkeys: Monkey[] = [] as Monkey[];
    for(let i=0; i<lines.length; i+=7){

     //   if(i%5===0){
            var numberPattern = /\d+/g;
            const items = lines[i+1].split(':')[1].split(',').map(x=> Number(x))
            const split =  lines[i+2].split(' ')
            const number = Number(split[7]) ?? 0;
            const operatorString= split[6];
            const numberString = split[7];
            const operator = getOperator([operatorString, numberString],number);
            const divisibleBy = Number(lines[i+3].match(numberPattern));
            const trueCon = Number(lines[i+4].match(numberPattern));
            const falseCon = Number(lines[i+5].match(numberPattern));

            const test = ((n: number)=> n%divisibleBy===0? trueCon : falseCon);

            const monkey = new Monkey(count, items, operator, test)
            monkeys.push(monkey);
            count++;
    }

    for(let m of monkeys){
        m.monkeys = monkeys;
    }

    return [monkeys, commonProduct];
}

export const pt1 = (f: string)=>{
    var lines = fs.readFileSync(f).toString().split("\n");
    const monkeys = processMonkeys(lines)

    for(let i = 0; i <1000; i++){
        for(let monkey of monkeys){
            monkey.runCycle();
        }
    }
    let sorted = monkeys.sort((a, b)=> b.inspectCount - a.inspectCount);
    monkeys.forEach(x=>{
        console.log(`monkey ${x.index}, count: ${x.inspectCount}`)
    });

    console.log(`monkey biz: ` + (sorted[0].inspectCount * sorted[1].inspectCount))
}


export const pt2 = (f: string)=>{
    var lines = fs.readFileSync(f).toString().split("\n");
    let processed = processMonkeys2(lines)
    const monkeys = processed[0]
    const lcm = processed[1];

    for(let i = 0; i <10000; i++){
        for(let monkey of monkeys){
            monkey.runCycle2(lcm);
        }
    }

    let sorted = monkeys.slice().sort((a, b)=> b.inspectCount - a.inspectCount);
    monkeys.forEach(x=>{
        console.log(`monkey ${x.index}, count: ${x.inspectCount}`)
    });
    console.log(`monkey biz: ` + (sorted[0].inspectCount * sorted[1].inspectCount))
}