import * as fs from 'fs'
import * as ld from 'lodash'

//credit to https://www.youtube.com/watch?v=YSDzaEi-xsA for the help

  interface ValveInfo {
    [key: string]: Valve;
 }
 interface PathInfo {
    [key: string]: number;
 }

 interface FlowInfo {
    [key: string]: number;
 }

 interface Valve {
    valve: string,
    flow: number,
    otherValves: string[],
    paths: PathInfo,
}

interface ValveInFlight {
    valve: string,
    flow: number,
    time: number,
    openValves: FlowInfo
}

interface TupleInfo {
  time: number,
  valve: string,
  bitmask: number
}

const toString = (ts: TupleInfo) => {
  let s = [];
  s.push(ts.time.toString());
  s.push(ts.valve.toString());
  s.push(ts.bitmask.toString());
  return s.join(',');
}

const toTupleStore = (s: string)=>{
  const split = s.split(',')
  return {
  time: Number(split[0]),
  valve: split[1],
  bitmask: Number(split[2])
} as TupleInfo;
}

interface TupleStore {
  [key: string]: number;
}

interface IndexStore {
  [key: string]: number;
}

const parseGraph = (f: string) => {
    const lines = fs.readFileSync(f, { encoding: 'utf-8' })
        .trim()
        .split("\n");

    const regexp =
        /^Valve (?<valve>[A-Z]{2}) has flow rate=(?<flow>\d+); tunnels? leads? to valves? (?<otherValves>.*)$/;

    const objects = lines.map((line) => {
        const data = line.match(regexp)?.groups;
        return {
            valve: data!['valve'],
            flow: parseInt(data!['flow']),
            otherValves: data!['otherValves'].split(", "),
            time: 0,
            paths: {}
        };
    });

    const graph: ValveInfo = {};
    objects.forEach((x) => graph[x.valve] = x);
    for (const node of objects) {
        bfs(graph, node);
    }
    return graph;
}

//populates the bfs traversal of the graph from each valve
function bfs(graph: ValveInfo, root: Valve) {
    const queue: Valve[] = [];
    root.paths = {};
    queue.push(root);
    const explored = new Set();
    explored.add(root.valve);

    while (queue.length > 0) {
        const current = queue.shift();
        if (current == null) break;
        for (const valve of graph[current.valve].otherValves) {
            if (!explored.has(valve)) {
                explored.add(valve);
                root.paths[valve] = (root.paths[current.valve] || 0) + 1;
                queue.push(graph[valve]);
            }
        }
    }
}

function dfs(graph: ValveInfo, time: number, root: Valve, bitmask: number, tapsOpen: Set<string>, globalSet: Set<string>, step: number): number{
 // const key = toString({time: time, valve: root, bitmask: bitmask} as unknown as TupleInfo)
  step++;
  let op: string[] = []
  const tabsOpenCopy: Set<string> = ld.cloneDeep(tapsOpen);
  tabsOpenCopy.forEach(x=> op.push(x))

  console.log("step: ".padStart(step, '-') + step + ', valve: ' + root.valve + ', time: ' + time + ', opened: ' + (op.length>0? op.join(',') : 'none'))
  let maxVal = 0;
  let validNeighbors = ld.cloneDeep(graph[root.valve].otherValves).filter(x => !tabsOpenCopy.has(x));
  
  if (validNeighbors.length === 0) validNeighbors = ld.cloneDeep(graph[root.valve].otherValves);
  if (globalSet.size === tabsOpenCopy.size) return maxVal;

  for(let n = 0; n < validNeighbors.length; n++){ 
    let remainingTime = time - graph[root.valve].paths[validNeighbors[n]];
    if(remainingTime ===0) console.log('remaining time: ' + remainingTime)
    if (remainingTime <= 0) continue;

    let sum = 0;
    if (graph[validNeighbors[n]].flow === 0) {
      //continue;
    }
    else {
      for (let o = 0; o < 2; o++) {
        const open = o === 0;
        if (open) {

          remainingTime -= 1;
          sum = (graph[validNeighbors[n]].flow * remainingTime);
          tabsOpenCopy.add(validNeighbors[n])
        }
        if(remainingTime ===0) console.log('remaining time: ' + remainingTime)
        if (remainingTime <= 0) continue;

        maxVal = Math.max(maxVal, dfs(graph, remainingTime, graph[validNeighbors[n]], bitmask, tabsOpenCopy, globalSet, step) + sum)
      }
    }

      maxVal = Math.max(maxVal, dfs(graph, remainingTime, graph[validNeighbors[n]], bitmask, tabsOpenCopy, globalSet, step) + sum)
  }
  return maxVal;
}


// computing the total flow of a list of open valves
const addFlow = (graph: ValveInfo, openValves: FlowInfo)=>  {
    let sum: number = 0;
    for (const key in openValves) {
      sum += graph[key].flow;
    }
    return sum;
} 
export const pt1=(f:string)=>{
    
    const graph = parseGraph(f);
    const time = 30; //minutes
    let maxFlow = 0;

    const queue: ValveInFlight[] = [];
    const root = {
      valve: "AA",
      time,
      flow: 0,
      openValves: {} as  FlowInfo
    };

    queue.push(root);

    while (queue.length > 0) {
        const current = queue.shift();
        if(current == null) break;

        if (current.time <= 0) {
          throw new Error("should not happen");
        }
        // Moving to another valve **that can be opened**
        const options = Object.values(graph).filter(
          (valve) => valve.flow > 0 && !current.openValves[valve.valve]
        );
        
        //termination condition if no new options available
        if (options.length === 0) {
          const ending =
            current.flow + (current.time * addFlow(graph, current.openValves));
          if (ending > maxFlow) {
            maxFlow = ending;
          }
        }
        for (const { valve } of options) {
          // Move AND open the valve 
          const steps = graph[current.valve].paths[valve] + 1; // steps to get to target value
          //termination condition
          if (current.time - steps <= 0) {
            const ending =
              current.flow + (current.time * addFlow(graph, current.openValves));
            if (ending > maxFlow) {
              maxFlow = ending;
            }
          } else {
            queue.push({
              valve: valve,
              time: current.time - steps,
              flow: current.flow + (steps * addFlow(graph, current.openValves)),
              openValves: { ...current.openValves, [valve]: current.time - steps },
            });
          }
        }
      }
    
      console.log(maxFlow);
}

export const pt2=(f:string)=>{
    
  const graph = parseGraph(f);
  const time = 30; //minutes
  let maxFlow = 0;

 // console.log(graph);
  let cache = {} as TupleStore;
  const root = graph['AA']


  const nonEmpty: string[]= [];
 for(let key in graph){
   let val = graph[key];
   if(val.valve !== 'AA' && val.flow>0)
    nonEmpty.push(val.valve);
 }

 let store: IndexStore = {};
 for(let i=0; i< nonEmpty.length; i++){
  store[nonEmpty[i]] = i;
 }

 const graphKeys = Object.keys(graph);
 let globalSet = new Set<string>();
 graphKeys.forEach(valve => graph[valve].otherValves.forEach(y => globalSet.add(y)));

 let tapsOpen = new Set<string>();
  //console.log(root)
let sum = dfs(graph, time, root, 0, tapsOpen, globalSet, 0)

console.log('sum: ' + sum)
}