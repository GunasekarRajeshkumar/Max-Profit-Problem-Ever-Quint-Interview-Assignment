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
  let maxProfit = -1;

  // First pass: find max profit
  for (let i = 0; i <= n; i++) {
    if (dp[i].profit > maxProfit) {
      maxProfit = dp[i].profit;
    }
  }

  // If no sequence found, return empty
  if (maxProfit < 0) {
    maxProfit = 0;
    return {
      profit: maxProfit,
      counts: { T: 0, P: 0, C: 0 },
      sequence: [],
      allSolutions: [],
    };
  }

  // Collect all optimal solutions
  const allSolutions = [];
  const seenCounts = new Set();

  // Collect all sequences with max profit
  // Filter out solutions where the last building finishes exactly at time n (0 operational time)
  for (let i = 0; i <= n; i++) {
    if (dp[i].profit === maxProfit && dp[i].sequence.length > 0) {
      // Skip solutions where finish time is exactly n (last building has 0 operational time)
      // Unless it's the only solution
      if (i === n) {
        // Check if there are other solutions finishing before n
        let hasOtherSolutions = false;
        for (let j = 0; j < n; j++) {
          if (dp[j].profit === maxProfit && dp[j].sequence.length > 0) {
            hasOtherSolutions = true;
            break;
          }
        }
        // If other solutions exist, skip this one
        if (hasOtherSolutions) continue;
      }

      const counts = countBuildings(dp[i].sequence);
      const countsKey = `${counts.T},${counts.P},${counts.C}`;

      // Only add unique solutions (by counts)
      if (!seenCounts.has(countsKey)) {
        seenCounts.add(countsKey);
        allSolutions.push({
          counts: counts,
          sequence: dp[i].sequence,
          finishTime: i,
        });
      }
    }
  }

  // Sort solutions: prefer solutions finishing before n, then by finish time
  allSolutions.sort((a, b) => {
    if (a.finishTime < n && b.finishTime === n) return -1;
    if (a.finishTime === n && b.finishTime < n) return 1;
    return b.finishTime - a.finishTime; // Higher finish time first
  });

  // Use the first solution as the primary one (for backward compatibility)
  const bestSolution =
    allSolutions.length > 0
      ? allSolutions[0]
      : { counts: { T: 0, P: 0, C: 0 }, sequence: [] };

  return {
    profit: maxProfit,
    counts: bestSolution.counts,
    sequence: bestSolution.sequence,
    allSolutions: allSolutions.map((sol) => sol.counts),
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
    console.log(`Earnings: $${result.profit}`);
    if (result.allSolutions && result.allSolutions.length > 0) {
      console.log("Solutions");
      result.allSolutions.forEach((sol, idx) => {
        console.log(`${idx + 1}. ${formatOutput(sol)}`);
      });
    } else {
      console.log(`Output: ${formatOutput(result.counts)}`);
    }
  } else {
    // Otherwise, run default test cases
    console.log("Test Case 1: Time Unit = 7");
    const result1 = findMaxProfit(7);
    console.log(`Earnings: $${result1.profit}`);
    if (result1.allSolutions && result1.allSolutions.length > 0) {
      console.log("Solutions");
      result1.allSolutions.forEach((sol, idx) => {
        console.log(`${idx + 1}. ${formatOutput(sol)}`);
      });
    } else {
      console.log(`Output: ${formatOutput(result1.counts)}`);
    }
    console.log();

    console.log("Test Case 2: Time Unit = 8");
    const result2 = findMaxProfit(8);
    console.log(`Earnings: $${result2.profit}`);
    if (result2.allSolutions && result2.allSolutions.length > 0) {
      console.log("Solutions");
      result2.allSolutions.forEach((sol, idx) => {
        console.log(`${idx + 1}. ${formatOutput(sol)}`);
      });
    } else {
      console.log(`Output: ${formatOutput(result2.counts)}`);
    }
    console.log();

    console.log("Test Case 3: Time Unit = 13");
    const result3 = findMaxProfit(13);
    console.log(`Earnings: $${result3.profit}`);
    if (result3.allSolutions && result3.allSolutions.length > 0) {
      console.log("Solutions");
      result3.allSolutions.forEach((sol, idx) => {
        console.log(`${idx + 1}. ${formatOutput(sol)}`);
      });
    } else {
      console.log(`Output: ${formatOutput(result3.counts)}`);
    }
    console.log();

    console.log("Test Case 4: Time Unit = 49");
    const result4 = findMaxProfit(49);
    console.log(`Earnings: $${result4.profit}`);
    if (result4.allSolutions && result4.allSolutions.length > 0) {
      console.log("Solutions");
      result4.allSolutions.forEach((sol, idx) => {
        console.log(`${idx + 1}. ${formatOutput(sol)}`);
      });
    } else {
      console.log(`Output: ${formatOutput(result4.counts)}`);
    }
    console.log();
  }
}
