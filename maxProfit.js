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
  // Stores the best solution for each time unit (finish time)
  const dp = new Array(n + 1).fill(null).map(() => ({
    profit: -1,
    sequence: [],
  }));

  // Initialize: we can always finish at time 0 with 0 profit and no buildings
  dp[0] = { profit: 0, sequence: [] };

  // Try all possible building sequences
  // For each possible finish time from 0 to n
  for (let time = 0; time <= n; time++) {
    // Skip if we haven't reached this state yet
    if (dp[time].profit < 0) {
      continue;
    }

    // Try adding each type of building
    for (const building of buildings) {
      const buildTime = building.time;
      const finishTime = time + buildTime;

      if (finishTime <= n) {
        // Calculate profit: operational time * earnings per unit
        const operationalTime = n - finishTime;
        const buildingProfit = operationalTime * building.earnings;
        const totalProfit = dp[time].profit + buildingProfit;

        // Update if this gives better profit
        if (dp[finishTime].profit < 0 || totalProfit > dp[finishTime].profit) {
          dp[finishTime] = {
            profit: totalProfit,
            sequence: [...dp[time].sequence, building],
          };
        }
      }
    }
  }

  // Find the maximum profit across all finish times
  // When there are ties, prefer solutions that finish before n (not exactly at n)
  let maxProfit = -1;
  let bestSequence = [];
  let bestFinishTime = -1;

  // First pass: find max profit
  for (let i = 0; i <= n; i++) {
    if (dp[i].profit > maxProfit) {
      maxProfit = dp[i].profit;
    }
  }

  // Second pass: among solutions with max profit, prefer those finishing before n
  // Among those, prefer higher finish time (uses more time)
  for (let i = n - 1; i >= 0; i--) {
    if (dp[i].profit === maxProfit && maxProfit >= 0) {
      bestSequence = dp[i].sequence;
      bestFinishTime = i;
      break; // Found the best: highest finish time < n
    }
  }

  // If no solution finishing before n, take the one at n
  if (bestFinishTime < 0 && dp[n].profit === maxProfit) {
    bestSequence = dp[n].sequence;
    bestFinishTime = n;
  }

  // If no sequence found, return empty counts
  if (maxProfit < 0) {
    maxProfit = 0;
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

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = { solveMaxProfit, findMaxProfit, formatOutput };
}

// Allow manual input from command line or run test cases
if (require.main === module) {
  const args = process.argv.slice(2);

  // If user provides a time unit as command line argument
  if (args.length > 0) {
    const timeUnit = parseInt(args[0]);

    if (isNaN(timeUnit) || timeUnit < 0) {
      console.log(
        "Error: Please provide a valid positive number for time units."
      );
      console.log("Usage: node maxProfit.js <time_unit>");
      console.log("Example: node maxProfit.js 49");
      process.exit(1);
    }

    console.log(`Time Unit: ${timeUnit}`);
    const result = findMaxProfit(timeUnit);
    console.log(`Output: ${formatOutput(result.counts)}`);
    console.log(`Earnings: $${result.profit}`);
  } else {
    // Otherwise, run default test cases
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

    console.log("Test Case 4: Time Unit = 49");
    const result4 = findMaxProfit(49);
    console.log(`Output: ${formatOutput(result4.counts)}`);
    console.log(`Earnings: $${result4.profit}`);
    console.log();
  }
}
