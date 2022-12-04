//const {identifyHighestCalorieCount} = require('./problems/solvers/day1-most-calories');
//const {computeTotalScorePart2} = require('./problems/solvers/day2-rockpaperscissors')
//const {computePrioritiesSumPar2} = require('./problems/solvers/day3-rucksack')
const {getRangeAnyOverlap, getRangeCountOfFullyContainedRanges} = require('./problems/solvers/day4-rangeids')

//day 1
// const calorieDataPath = './problems/data/day1-calories.txt';
// let [highestCalorieCount, largestThreeSum] = identifyHighestCalorieCount(calorieDataPath);
// console.log(`single highest: ${highestCalorieCount}, top 3 sum: ${largestThreeSum}`)


//day 2 
// const rockPaperScissorPath = './problems/data/day2-strategy-guide.txt';
// let totalScore = computeTotalScorePart2(rockPaperScissorPath);

//day 3 const
// const ruckSacks = './problems/data/day3-rucksack.txt'
// let totalPriority = computePrioritiesSumPar2(ruckSacks)

//day 4
const rangeIds = './problems/data/day4-ranges.txt'
let totalPriority = getRangeAnyOverlap(rangeIds)