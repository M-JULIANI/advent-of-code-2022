import * as fs from 'fs';
export const pt1 = (f: string)=>{
    const read = fs.readFileSync(f).toString();
  
    const setSize = 4
    for(let i = 0; i< read.length-setSize+1; i++){
        let set: Set<string> = new Set<string>();
        set.add(read[i])
        set.add(read[i+1])
        set.add(read[i+2])
        set.add(read[i+3])
        if (set.size === setSize) return i + setSize
    }
    return -1
}

export const pt2 = (f: string)=>{
    const read = fs.readFileSync(f).toString();
  
    const setSize = 14
    for(let i = 0; i< read.length-setSize+1; i++){
        let set: Set<string> = new Set<string>();
        for(let j = 0; j< setSize; j++)set.add(read[i+j])
        if (set.size === setSize) return i + setSize
    }
    return -1
}