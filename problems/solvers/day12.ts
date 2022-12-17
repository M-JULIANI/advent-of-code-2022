import * as fs from 'fs'
import { start } from 'repl';
import { formatNumberMatrix, formatStringMatrix } from '../../helpers/formatters';
import { makeMatrix, makeMatrixS } from '../../helpers/matrix';
import { vecToString, Vec2, vecToInt } from '../../objects/objects'
import { Node } from '../../objects/Node';


const getNeighbors = (start: Node, xSize: number, ySize: number, grid: Map<string, Node>) =>{

    let neighbors = [];
    for(let i = -1; i<= 1; i++){
        for(let j = -1; j<= 1; j++){
            if(i===0 && j ===0) continue;
            if(i!== 0 && j !==0) continue;
            const indexY= start.j + j;
            const indexX = start.i + i;

            //out of bounds
            if(indexX>ySize-1 || indexX<0 || indexY>xSize-1 || indexY<0) continue;

            let vec = {x: indexX, y: indexY} as Vec2
            let neighbor = grid.get(vecToString(vec));
            if(start.canMoveTo(start, neighbor!)){
                neighbors.push(neighbor)
           }
        }
    }
    return neighbors;
}

const getNeighbors2 = (start: Node, xSize: number, ySize: number, grid: Map<string, Node>) =>{

    let neighbors = [];
    for(let i = -1; i<= 1; i++){
        for(let j = -1; j<= 1; j++){
            if(i===0 && j ===0) continue;
            if(i!== 0 && j !==0) continue;
            const indexY= start.j + j;
            const indexX = start.i + i;

            //out of bounds
            if(indexX>ySize-1 || indexX<0 || indexY>xSize-1 || indexY<0) continue;

            let vec = {x: indexX, y: indexY} as Vec2
            let neighbor = grid.get(vecToString(vec));
            if(start.canMoveTo2(start, neighbor!)){
                neighbors.push(neighbor)
           }
        }
    }
  //  console.log('neighbors: ' + neighbors.length)
    return neighbors;
}

const djikstra = (grid: Map<string, Node>, start: Node, end: Node, xSize: number, ySize: number):[number[], Node] =>{
    let dist:number[] = [];
    let closed: Node[] = []
    let path: Node[] = []
    let outputNodes = [] as Node[];
    //initializing queue
    let queue:Node[] = [];
    let thisCurrent: Node;

    for(let y =0; y< ySize; y++){
        for(let x =0; x< xSize; x++){
            let index = {x: y, y: x} as Vec2;
            let ind = vecToString(index);
            let cell = grid.get(ind);
            dist[vecToInt(index)] = Infinity
            queue.push(cell!);
        }
    }

   dist[vecToInt(start.pos)] = 0;

    while(queue.length){
        let current: Node | null= null;
        for(const q of queue){
            if(current === null || dist[vecToInt(q.pos)] < dist[vecToInt(current!.pos)])
                current = q;
        }

        thisCurrent = current!;

        if(current=== end) break;
        queue = queue.filter(q=>q !== current) //remove current from queue
        closed.push(current!);
        const neighbors = getNeighbors(current!, xSize, ySize, grid).filter(x=> !closed.includes(x!))
        for(let neighbor of neighbors){
            if(queue.includes(neighbor!)){
                const newDist: number = dist[vecToInt(current!.pos)] + 1;
                if(newDist< dist[vecToInt(neighbor!.pos)]){
                  dist[vecToInt(neighbor!.pos)] = newDist;
                  neighbor!.setParent(current!);
                  thisCurrent.setParent(neighbor!);
                }
            }
        }
    }

    return [dist, thisCurrent!];
}

const djikstraReverse= (grid: Map<string, Node>, start: Node, xSize: number, ySize: number):number=>{
    let dist:number[] = [];
    let closed: Node[] = []
    let queue:Node[] = [];

    let prev:Node;

    for(let y =0; y< ySize; y++){
        for(let x =0; x< xSize; x++){
            let index = {x: y, y: x} as Vec2;
            let ind = vecToString(index);
            let cell = grid.get(ind);
            dist[vecToInt(index)] = Infinity
            queue.push(cell!);
        }
    }

   dist[vecToInt(start.pos)] = 0;

    while(queue.length){
        let current: Node | null= null;
        for(const q of queue){
            if(current === null || dist[vecToInt(q.pos)] < dist[vecToInt(current!.pos)])
                current = q;
        }

        if(current?.height ===0) {
            //return dist[vecToInt(current!.pos)];
            console.log(current);
            console.log(grid.get(vecToString(current!.pos)))
            return dist[vecToInt(prev!.pos)];
        }
        queue = queue.filter(q=>q !== current) //remove current from queue
        prev = current!;
        const neighbors = getNeighbors2(current!, xSize, ySize, grid)
        for(let neighbor of neighbors){
            if(queue.includes(neighbor!)){
                const newDist: number = dist[vecToInt(current!.pos)] + 1;
                if(newDist< dist[vecToInt(neighbor!.pos)]){
                  dist[vecToInt(neighbor!.pos)] = newDist;
                }
            }
        }
    }

    return 0;
}

class Astar{

    grid: Map<string, Node>;
    start: Node;
    end: Node;
    xSize: number;
    ySize: number;
    constructor(grid: Map<string, Node>, start: Node, end: Node, xSize: number, ySize: number){
        this.grid = grid;
        this.start = start;
        this.end = end;
        this.xSize = xSize;
        this.ySize = ySize;
    }

    run = ():Node[] =>{

        if(this.start == null || this.end == null || this.grid == null || this.xSize===0 || this.ySize ===0) return [] as Node[];
        let closed = [] as Node[];
        let open = [] as Node[];
        this.start.gcost = 1;
        this.start.hcost = this.computeDistance(this.start, this.end);
        open.push(this.start);
        let currentNode: Node;
    
        let count= 0 ;
        while (open.length > 0) {
            currentNode = open[0]
           // if(count>3) break;
            //find the neighbor with a lower fcost that current, otherwise lower hcost
            for(let i = 1; i<open.length; i++){
                if(open[i].fcost< currentNode.fcost 
                    ||(open[i].fcost === currentNode.fcost && open[i].hcost< currentNode.hcost)){
                    currentNode = open[i];
                }
            }
            //remove from open set, add to closed set
            open = open.filter(x=>!(x.i === currentNode.i && x.j === currentNode.j))
            closed.push(currentNode);
    
            //break if path has been found
            if (currentNode.i == this.end.i && currentNode.j === this.end.j) break;
    
           // console.log('current: ')
           // console.log(currentNode.pos)
            let neighbors = getNeighbors(currentNode!, this.xSize, this.ySize, this.grid).filter(x => !closed.includes(x!))
            //console.log('n: ')
            //console.log(neighbors)
    
            for(let neighbor of neighbors){
                let costToMove = currentNode.gcost +1; 
    
                if(costToMove < neighbor?.gcost! || !open.includes(neighbor!)){
                    neighbor!.gcost = costToMove;
                    neighbor!.hcost = this.computeDistance(neighbor!, this.end);
                    neighbor!.setParent(currentNode);
                   // grid.set(vecToString(neighbor!.pos), neighbor!);
    
                    if(!open.includes(neighbor!)) open.push(neighbor!);
                }
            }
            count++;
        }
    
        return this.getPath(this.start, currentNode!);
        }
    computeDistance = (n: Node, n1: Node): number => {
        let distX = Math.abs(n.i - n1.i);
        let distY = Math.abs(n.j - n1.j);
        let distZ = n1.height - n.height === 0 ? 1 : n1.height - n.height;
        if(distX> distY)
        return 1 * distY + (1 * (distX + distY)) + distZ;
    
        return 1 * distX + (1 * (distY - distX)) + distZ;
    }
    
    getPath = (s: Node, t: Node) =>{
        let path = [];
    
        let current  = t;
        path.push(current);
        while (current.parent != null) {
            if(current === s) break;
    
            current = current.parent;
            path.push(current);
        }
        path = path.reverse();
        return path;
    }
}

export const pt1 = (f: string)=> {
    var lines = fs.readFileSync(f).toString().split("\n");
    const abcs: string = 'abcdefghijklmnopqrstuvwxyz'

    const vals: Map<string, number> = new Map<string, number>();
    for (let cc = 0; cc< abcs.length; cc++) {
        vals.set(abcs[cc], cc);
    }

    let x = lines[0].length;
    let y = lines.length;

    //let m = makeMatrix(x,y, 0);
    let m : number[][]= makeMatrix(x, y, 0)

    let grid: Map<string, Node> = new Map<string, Node>();
    let sm = makeMatrixS(x, y, '0');

    let startNode: Node;
    let endNode: Node;
    for (let j = 0; j < lines.length; j++) {
        for (let i = 0; i < lines[0].length; i++) {
            let ll = lines[j][i]
            if (ll === 'S') {
                ll = 'a'
                startNode = new Node(j, i, 0);
                grid.set(vecToString(startNode!.pos), startNode);
            }
            if (ll === 'E') {
                ll = 'z'
                endNode = new Node(j, i, 25)
                grid.set(vecToString(endNode!.pos), endNode);
            }

            // console.log(ll)
            let n = vals.get(ll)
            if (n == null) continue;

            let node = new Node(j,i, n)
            grid.set(vecToString(node.pos), node);
            m[j][i] = n;
            sm[j][i] = ll;
        }
    }
let astar = new Astar(grid, startNode!, endNode!, x, y);
let shortest = astar.run();
if(shortest.length>0){
    console.log('astar length: ' + shortest.length)
}
    let shortestPathMap = djikstra(grid, startNode!, endNode!, x, y);
   let steps = shortestPathMap[0][vecToInt(endNode!.pos)]
    console.log('djkistra length: ' + steps)

    //viz stuff
    let mn = makeMatrix(x, y, 0);
//    path.forEach((x, i)=> {
//     mn[x.i][x.j] = i % 99
//     sm[x.i][x.j] = '9'});

//    let stringMN = mn.map(x=> x.map(y=>y.toString()));
//    console.log(formatStringMatrix(sm))

//    let set = new Set<string>();
//    path.forEach(x=> set.add(vecToString(x.pos)));
//    console.log('set length: ' + set.size)
    //const monkeys = processMonkeys(lines)
}

export const pt2 = (f: string)=> {
    var lines = fs.readFileSync(f).toString().split("\n");
    const abcs: string = 'abcdefghijklmnopqrstuvwxyz'

    const vals: Map<string, number> = new Map<string, number>();
    for (let cc = 0; cc< abcs.length; cc++) {
        vals.set(abcs[cc], cc);
    }

    let x = lines[0].length;
    let y = lines.length;

    //let m = makeMatrix(x,y, 0);
    let m : number[][]= makeMatrix(x, y, 0)

    let grid: Map<string, Node> = new Map<string, Node>();
    let sm = makeMatrixS(x, y, '0');

    let startNode: Node;
    for (let j = 0; j < lines.length; j++) {
        for (let i = 0; i < lines[0].length; i++) {
            let ll = lines[j][i]
            if (ll === 'E') {
                ll = 'z'
                startNode = new Node(j, i, 25)
               // grid.set(vecToString(startNode!.pos), startNode);
            }
            let n = vals.get(ll)
            let node = new Node(j,i, n!)
            grid.set(vecToString(node.pos), node);
            m[j][i] = n!;
            sm[j][i] = ll;
        }
    }



    let shortReverse = djikstraReverse(grid, startNode!, x, y);
    console.log('djkistra reverse: ' + shortReverse)
    return shortReverse;
}