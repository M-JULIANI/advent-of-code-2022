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
        //   console.log('item : ' + item)
           item = this.operation(item!);
        //   console.log('operated item : ' + item)
           item = Math.floor(item/3);
        //   console.log('minus worry / 3: ' + item)
           let monkeyToGiveTo = this.actualTest(item);
           //console.log('giveto: ' + monkeyToGiveTo)
         //  console.log('m: ' + this.monkeys[monkeyToGiveTo].items)
           this.monkeys[monkeyToGiveTo].addItem(item);
         //  console.log('m after: ' + this.monkeys[monkeyToGiveTo].items)
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

            // console.log('items: ' + items)
            // console.log('number: ' + number)
            // console.log('operatorstring: ' + operatorString)
            // console.log('operator: ' + operator)
            // console.log('div by: ' + divisibleBy)
            // console.log('truecon: ' + trueCon)
            // console.log('falsecon: ' + falseCon)
            // console.log('---')
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

export const pt1 = (f: string)=>{
    var lines = fs.readFileSync(f).toString().split("\n");
    const monkeys = processMonkeys(lines)

    for(let i = 0; i <20; i++){
        for(let monkey of monkeys){
            monkey.runCycle();
        }
    }

    monkeys.forEach(x=>{
        console.log(`m ${x.index}, carrying ${x.items}`)
    })

    let sorted = monkeys.sort((a, b)=> b.inspectCount - a.inspectCount);
    sorted.forEach(x=>{
        console.log(`monkey ${x.index}, count: ${x.inspectCount}`)
    });

    console.log(`monkey biz: ` + (sorted[0].inspectCount * sorted[1].inspectCount))
}