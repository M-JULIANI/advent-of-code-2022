const {identifyHighestCalorieCount} = require('./problems/solvers/day1-most-calories');

const calorieDataPath = './problems/data/day1-calories.txt';
let [highestCalorieCount, largestThreeSum] = identifyHighestCalorieCount(calorieDataPath);