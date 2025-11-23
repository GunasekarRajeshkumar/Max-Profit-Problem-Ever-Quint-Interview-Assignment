/**
 * Max Profit Problem - Ever Quint Interview Assignment
 *
 * Three types of establishments:
 * - Theatre: 5 units to build, earns $1500 per unit operational
 * - Pub: 4 units to build, earns $1000 per unit operational
 * - Commercial Park: 10 units to build, earns $2000 per unit operational
 *
 * Properties must be built sequentially (one after another).
 * After building completes at time t, it earns money for (n - t) units.
 */

const BUILDING_TYPES = {
  THEATRE: { time: 5, earnings: 1500, name: "T" },
  PUB: { time: 4, earnings: 1000, name: "P" },
  COMMERCIAL: { time: 10, earnings: 2000, name: "C" },
};

/**
 * Calculate profit for a given sequence of buildings
 * @param {Array} sequence - Array of building types
 * @param {number} totalTime - Total time units available
 * @returns {number} Total profit
 */
function calculateProfit(sequence, totalTime) {
  let currentTime = 0;
  let totalProfit = 0;

  for (const building of sequence) {
    currentTime += building.time;
    if (currentTime > totalTime) {
      // This building can't be completed in time
      break;
    }
    const operationalTime = totalTime - currentTime;
    totalProfit += operationalTime * building.earnings;
  }

  return totalProfit;
}

/**
 * Count buildings in a sequence
 * @param {Array} sequence - Array of building types
 * @returns {Object} Count of each building type
 */
function countBuildings(sequence) {
  const counts = { T: 0, P: 0, C: 0 };
  for (const building of sequence) {
    counts[building.name]++;
  }
  return counts;
}

/**
 * Find the optimal combination of buildings to maximize profit
 * Uses dynamic programming for optimal performance
 * @param {number} n - Total time units available
 * @returns {Object} { profit, counts, sequence }
 */
function findMaxProfit(n) {
  const buildings = [
    BUILDING_TYPES.THEATRE,
    BUILDING_TYPES.PUB,
    BUILDING_TYPES.COMMERCIAL,
  ];

  // DP table: dp[time] = { profit, sequence }
  // Stores the best solution for each time unit
  const dp = new Array(n + 1).fill(null).map(() => ({
    profit: 0,
    sequence: [],
  }));

  // Try all possible building sequences
  for (let time = 0; time <= n; time++) {
    for (const building of buildings) {
      const buildTime = building.time;
      const finishTime = time + buildTime;

      if (finishTime <= n) {
        // Calculate profit: operational time * earnings per unit
        const operationalTime = n - finishTime;
        const buildingProfit = operationalTime * building.earnings;
        const totalProfit = dp[time].profit + buildingProfit;

        // Update if this gives better profit
        if (totalProfit > dp[finishTime].profit) {
          dp[finishTime] = {
            profit: totalProfit,
            sequence: [...dp[time].sequence, building],
          };
        }
      }
    }
  }

  // Find the maximum profit across all finish times
  let maxProfit = 0;
  let bestSequence = [];

  for (let i = 0; i <= n; i++) {
    if (dp[i].profit > maxProfit) {
      maxProfit = dp[i].profit;
      bestSequence = dp[i].sequence;
    }
  }

  const counts = countBuildings(bestSequence);

  return {
    profit: maxProfit,
    counts: counts,
    sequence: bestSequence,
  };
}

/**
 * Format output as required: "T: [number] P: [number] C: [number]"
 * @param {Object} counts - Object with T, P, C counts
 * @returns {string} Formatted output string
 */
function formatOutput(counts) {
  return `T: ${counts.T} P: ${counts.P} C: ${counts.C}`;
}

/**
 * Main function to solve the problem
 * @param {number} n - Total time units
 * @returns {string} Formatted output
 */
function solveMaxProfit(n) {
  const result = findMaxProfit(n);
  return formatOutput(result.counts);
}

// Test cases
console.log("Test Case 1: Time Unit = 7");
const result1 = findMaxProfit(7);
console.log(`Output: ${formatOutput(result1.counts)}`);
console.log(`Earnings: $${result1.profit}`);
console.log();

console.log("Test Case 2: Time Unit = 8");
const result2 = findMaxProfit(8);
console.log(`Output: ${formatOutput(result2.counts)}`);
console.log(`Earnings: $${result2.profit}`);
console.log();

console.log("Test Case 3: Time Unit = 13");
const result3 = findMaxProfit(13);
console.log(`Output: ${formatOutput(result3.counts)}`);
console.log(`Earnings: $${result3.profit}`);
console.log();

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = { solveMaxProfit, findMaxProfit, formatOutput };
}
