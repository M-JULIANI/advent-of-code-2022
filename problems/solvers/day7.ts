import * as fs from 'fs'

class Node {
    children: Node [] = [];
    parent: Node | null = null;
    name: string;
    isFile: boolean;
    size: number = 0;
    constructor(name: string, isFile: boolean, size: number = 0){
        this.name = name;
        this.isFile = isFile;
        this.size = size;
    }

    addChild(n: Node){
        n.parent = this;
        this.children.push(n);
    }

    hasChildren(){
        return this.children != null && this.children.length>0;
    }

    getChild(nodeName: string){
        return this.children.find(x=> x.name === nodeName) ?? null;
    }
}
export const pt1 = (f: string) =>{
    var lines = fs.readFileSync(f).toString().split("\n");
    let rootNode = new Node('/', false);
    let currentNode = rootNode;

    //construct tree
    for (let i = 0; i < lines.length; i++) {

        const split = lines[i].split(' ');

        //move out
        if (lines[i].startsWith('$ cd ..')) {
            currentNode = currentNode.parent ?? rootNode;
        }
        else if (lines[i].startsWith('$ cd')) {
            const dirName = split[2];
            if (dirName === '/') {
                currentNode = rootNode;
                continue;
            }
            const child =currentNode.getChild(dirName)
            if(child!=null) currentNode = child;
        }
        //add folder
        else if(lines[i].startsWith('dir')) currentNode.addChild(new Node(split[1], false));
        //actual file
        else if(!lines[i].startsWith('$ ls')) {
            currentNode.addChild(new Node(split[1], true, Number(split[0])));
        }
    }

    let sum = { sum: 0 }
    seedAllOtherLeaves(rootNode);
    computeSumOfDirectories(rootNode, 100000, sum)
    console.log(`total sum ${sum.sum}`);
}

const seedAllOtherLeaves = (n: Node)=>{
    let current = n;
    let latest = {l:null}
    let i = 0;
    while(i<100){
        seedInnermostLeaves(current, latest, true);
        i++;
    }
    return latest;
}
const seedInnermostLeaves = (n: Node, latest: {l: Node|null}, root: boolean) => {
    let currentChild = n;
    if(root) latest.l = currentChild;
    let isRoot = currentChild.children.every(x=> x.size>0);
    if (isRoot) {
        const sum = currentChild.children.map(x => x.size).reduce((sum, current) => sum + current, 0)
        currentChild.size = sum;
    }
    currentChild.children.filter(x=>!x.isFile).map(x=>{
        return seedInnermostLeaves(x, latest, false)})
}

// computes the fully populates linked-list
const computeSumOfDirectories = (n: Node, target: number, totalSum: { sum: number }) => {

    const sum = n.children.map(x => x.size).reduce((sum, current) => sum + current, 0)
    if (sum <= target) {
        totalSum.sum += sum;
        console.log(`node: ${n.name}, sum: ${sum}, is ${target} or less in size`)
    }
    n.children.forEach(x => computeSumOfDirectories(x, target, totalSum))
}       