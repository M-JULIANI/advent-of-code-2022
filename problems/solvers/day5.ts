import * as fs from 'fs';

interface IStack<T> {
    push(item: T): void;
    pop(): T | undefined;
    peek(): T | undefined;
    size(): number;
  }

class Stack<T> implements IStack<T> {
    private storage: T[] = [];

    constructor(private items: T[]){
        this.storage = items.slice()
    }
  
    push(item: T): void {
      this.storage.push(item);
    }
  
    pop(): T | undefined {
      return this.storage.pop();
    }
  
    peek(): T | undefined {
      return this.storage[this.size() - 1];
    }
  
    size(): number {
      return this.storage.length;
    }
  }

  export const initializeStacks = () =>{
     // initialize stacks
     let stacks: Stack<string>[] = []
     stacks[0] = new Stack(['S', 'Z', 'P', 'D', 'L', 'B', 'F', 'C' ])
     stacks[1] = new Stack(['N', 'V', 'G', 'P', 'H', 'W', 'B' ])
     stacks[2] = new Stack(['F', 'W', 'B', 'J', 'G'])
     stacks[3] = new Stack(['G', 'J', 'N', 'F', 'L', 'W', 'C','S'])
     stacks[4] = new Stack(['W', 'J', 'L', 'T', 'P', 'M', 'S','H'])
     stacks[5] = new Stack(['B', 'C', 'W', 'G', 'F', 'S'])
     stacks[6] = new Stack(['H', 'T', 'P', 'M', 'Q', 'B', 'W'])
     stacks[7] = new Stack(['F', 'S', 'W', 'T'])
     stacks[8] = new Stack(['N', 'C', 'R'])
     return stacks
  }
export const pt1 = (filePath: string, stacks: Stack<string>[]) =>{
    var instructionText = fs.readFileSync(filePath).toString().split("\n");
    for (let line of instructionText) {
        if(!line.startsWith('m')) continue;
            let splits = line.split(' ')
            let numCrates = Number(splits[1])
            let from = Number(splits[3]) - 1
            let to = Number(splits[5]) - 1
            for (let c = 0; c < numCrates; c++) {
                let currentStack = stacks[from]
                if (currentStack.size() > 0) {
                    let toMove = stacks[from].pop()
                    if (toMove != null) stacks[to].push(toMove)
                }
            }
    }

    for(let s = 0; s< stacks.length; s++){
        console.log(stacks[s].peek())
    }
}

//part2
export const pt2 = (filePath: string, stacks: Stack<string>[]) => {
    var instructionText = fs.readFileSync(filePath).toString().split("\n");
    for (let line of instructionText) {
        if (!line.startsWith('m')) continue;
        let splits = line.split(' ')
        let numCrates = Number(splits[1])
        let from = Number(splits[3]) - 1
        let to = Number(splits[5]) - 1

        let queue: string[] = []
        for (let c = 0; c < numCrates; c++) {
            let currentStack = stacks[from]
            if (currentStack.size() > 0) {
                let toMove = stacks[from].pop()
                if (toMove != null) queue.push(toMove)
            }
        }

        queue.reverse()
        for (let q = 0; q < queue.length; q++) {
            stacks[to].push(queue[q])
        }
    }

    for (let s = 0; s < stacks.length; s++) {
        console.log(stacks[s].peek())
    }
}