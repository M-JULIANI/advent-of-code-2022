import * as fs from 'fs'

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

const parseGraph = (f:string)=> {
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

    //console.log(objects)

    const graph: ValveInfo = {};
    objects.forEach((x) => graph[x.valve] = x);
   // console.log(graph)

    for (const node of objects) {
        bfs(graph, node);
    }
    //console.log('post bfs:')
    //console.log(graph)
    return graph;
}

//populates the bfs traversal of the graph from each valve
function bfs(graph: ValveInfo, root: Valve) {
    const queue: Valve[] = [];
    root.paths = {};
    const explored = new Set();
    explored.add(root.valve);
    queue.push(root);

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
          const steps = graph[current.valve].paths[valve] + 1;
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
              flow: current.flow + steps * addFlow(graph, current.openValves),
              openValves: { ...current.openValves, [valve]: current.time - steps },
            });
          }
        }
      }
    
      console.log(maxFlow);
}