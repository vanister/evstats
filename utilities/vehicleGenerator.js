/**
 * Vehicle Data Generator
 * 
 * Generates realistic EV data as CSV files for import via the ImportScreen.
 * Based on current market EVs available in 2023-2025 from evDatabase.js.
 * This script does NOT write directly to the database - it only creates CSV files 
 * that can be imported through the app's import functionality.
 * 
 * Usage:
 *   node vehicleGenerator.js [options]
 * 
 * Options:
 *   --count=N       Number of vehicles to generate (default: 3, max: 100)
 *   --output=PATH   Output directory path (default: ../playground)
 *   --sequential    Use sequential selection instead of random (default: random)
 */

import parseArgs from 'minimist';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { evDatabase } from './evDatabase.js';

const args = parseArgs(process.argv.slice(2));
const {
  count = 3,
  output = '../playground',
  sequential = false
} = args;

const writeln = (...msg) => {
  console.log(...msg);
};

function generateVehicleData() {
  const maxCount = Math.min(count, evDatabase.length);
  let selectedVehicles;

  if (sequential) {
    // Take first N vehicles (sequential)
    selectedVehicles = evDatabase.slice(0, maxCount);
  } else {
    // Shuffle array and take first N (random - default)
    const shuffled = [...evDatabase].sort(() => 0.5 - Math.random());
    selectedVehicles = shuffled.slice(0, maxCount);
  }

  return selectedVehicles;
}

function outputCSV(vehicles) {
  const csvContent = [
    'year,make,model,trim,vin,nickname,battery_size,range',
    ...vehicles.map(vehicle => 
      `${vehicle.year},${vehicle.make},${vehicle.model},${vehicle.trim},${vehicle.vin},,${vehicle.battery_size},${vehicle.range}`
    )
  ].join('\n');

  const outputPath = path.resolve(output, 'vehicles.csv');
  
  // Ensure directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  
  fs.writeFileSync(outputPath, csvContent);
  writeln(`CSV file written to: ${outputPath}`);
}

function printStatistics(vehicles) {
  const makeStats = {};
  const yearStats = {};
  
  vehicles.forEach(vehicle => {
    makeStats[vehicle.make] = (makeStats[vehicle.make] || 0) + 1;
    yearStats[vehicle.year] = (yearStats[vehicle.year] || 0) + 1;
  });
  
  writeln(`\n--- Statistics ---`);
  writeln(`Total vehicles: ${vehicles.length}`);
  
  writeln(`\nVehicles by manufacturer:`);
  Object.entries(makeStats)
    .sort(([,a], [,b]) => b - a)
    .forEach(([make, count]) => {
      writeln(`  ${make}: ${count} vehicles`);
    });
  
  writeln(`\nVehicles by year:`);
  Object.entries(yearStats)
    .sort(([a], [b]) => parseInt(b) - parseInt(a))
    .forEach(([year, count]) => {
      writeln(`  ${year}: ${count} vehicles`);
    });

  // Battery capacity stats
  const batteries = vehicles.map(v => v.battery_size).sort((a, b) => a - b);
  const avgBattery = batteries.reduce((sum, cap) => sum + cap, 0) / batteries.length;
  writeln(`\nBattery capacity:`);
  writeln(`  Range: ${batteries[0]} - ${batteries[batteries.length - 1]} kWh`);
  writeln(`  Average: ${avgBattery.toFixed(1)} kWh`);

  // Range stats
  const ranges = vehicles.map(v => v.range).sort((a, b) => a - b);
  const avgRange = ranges.reduce((sum, range) => sum + range, 0) / ranges.length;
  writeln(`\nEPA Range:`);
  writeln(`  Range: ${ranges[0]} - ${ranges[ranges.length - 1]} miles`);
  writeln(`  Average: ${avgRange.toFixed(0)} miles`);
}

try {
  const maxVehicles = evDatabase.length;
  const requestedCount = Math.min(count, maxVehicles);
  
  if (count > maxVehicles) {
    writeln(`Warning: Requested ${count} vehicles, but only ${maxVehicles} available. Generating ${maxVehicles} vehicles.`);
  }
  
  writeln(`Generating ${requestedCount} EVs from database of ${maxVehicles} vehicles...\n`);
  
  const vehicles = generateVehicleData();
  
  outputCSV(vehicles);
  printStatistics(vehicles);
  
} catch (error) {
  console.error(error);
}
