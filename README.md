# Max Profit Problem - Ever Quint Interview Assignment

A dynamic programming solution to find the optimal combination of buildings that maximizes profit within a given time constraint.

## Problem Description

Mr. X owns land in Mars Land with infinite capacity. He can build three types of establishments sequentially:

- **Theatre (T)**: Takes 5 units of time to build, earns **$1500** per unit of time operational
- **Pub (P)**: Takes 4 units of time to build, earns **$1000** per unit of time operational  
- **Commercial Park (C)**: Takes 10 units of time to build, earns **$2000** per unit of time operational

### Rules:
1. Buildings must be built sequentially (one after another)
2. Once a building completes construction at time `t`, it earns money for `(n - t)` units of time
3. Cannot build two properties in parallel in one unit of time
4. Goal: Maximize total profit for a given time unit `n`

## Solution

The solution uses **Dynamic Programming** to efficiently find the optimal combination of buildings that maximizes profit.

### Algorithm:
- `dp[time]` stores the maximum profit achievable by finishing construction at time `time`
- For each building type, we calculate the profit if we build it after reaching state `time`
- We update `dp[finishTime]` if the new profit is better
- After processing all possibilities, we find the maximum profit across all finish times
- Tie-breaking: Prefers solutions that finish before time `n` (uses more available time)

## Installation

No additional dependencies required. Just ensure you have Node.js installed.

## Usage

### Method 1: Run with Command Line Argument

Provide a time unit as a command-line argument:

```bash
node maxProfit.js <time_unit>
```

**Example:**
```bash
node maxProfit.js 49
```

**Output:**
```
Time Unit: 49
Output: T: 8 P: 2 C: 0
Earnings: $324000
```

### Method 2: Run Default Test Cases

Run the script without arguments to see all test cases:

```bash
node maxProfit.js
```

**Output:**
```
Test Case 1: Time Unit = 7
Output: T: 1 P: 0 C: 0
Earnings: $3000

Test Case 2: Time Unit = 8
Output: T: 1 P: 0 C: 0
Earnings: $4500

Test Case 3: Time Unit = 13
Output: T: 2 P: 0 C: 0
Earnings: $16500

Test Case 4: Time Unit = 49
Output: T: 8 P: 2 C: 0
Earnings: $324000
```

### Method 3: Use as a Module

```javascript
const { findMaxProfit, formatOutput, solveMaxProfit } = require('./maxProfit.js');

// Get full result object
const result = findMaxProfit(49);
console.log(formatOutput(result.counts));  // "T: 8 P: 2 C: 0"
console.log(result.profit);                // 324000

// Or get just the formatted output
const output = solveMaxProfit(49);
console.log(output);  // "T: 8 P: 2 C: 0"
```

## Test Cases

| Time Unit | Expected Output | Earnings |
|-----------|----------------|----------|
| 7 | T: 1 P: 0 C: 0 | $3,000 |
| 8 | T: 1 P: 0 C: 0 | $4,500 |
| 13 | T: 2 P: 0 C: 0 | $16,500 |
| 49 | T: 8 P: 2 C: 0 | $324,000 |

## Example Calculations

### Example 1: Time Unit = 8
- Build 1 Theatre: finishes at time 5
- Operational for (8 - 5) = 3 units
- Profit: 3 × $1500 = **$4,500**

### Example 2: Time Unit = 49
- Build 8 Theatres: finish at times 5, 10, 15, 20, 25, 30, 35, 40
- Build 2 Pubs: finish at times 44, 48
- Total profit from all buildings: **$324,000**

## Functions

### `findMaxProfit(n)`
Finds the optimal combination of buildings to maximize profit.

**Parameters:**
- `n` (number): Total time units available

**Returns:**
- `{ profit: number, counts: { T: number, P: number, C: number }, sequence: Array }`

### `solveMaxProfit(n)`
Convenience function that returns formatted output string.

**Parameters:**
- `n` (number): Total time units available

**Returns:**
- `string`: Formatted output like "T: 8 P: 2 C: 0"

### `formatOutput(counts)`
Formats the building counts into the required output format.

**Parameters:**
- `counts` (Object): Object with T, P, C counts

**Returns:**
- `string`: Formatted output string

## Complexity

- **Time Complexity**: O(n × m) where `n` is the time units and `m` is the number of building types (3)
- **Space Complexity**: O(n) for the DP table

## Error Handling

If an invalid time unit is provided:
```
Error: Please provide a valid positive number for time units.
Usage: node maxProfit.js <time_unit>
Example: node maxProfit.js 49
```

## Author

Gunasekar - Ever Quint Interview Assignment

