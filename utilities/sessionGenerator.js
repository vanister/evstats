/**
 * Dynamic Session Data Generator
 * 
 * Generates realistic charging session data based on actual vehicles in the database.
 * This script connects to the SQLite database, reads existing vehicles, and creates
 * sessions compatible with the ImportScreen functionality.
 * 
 * Usage:
 *   node sessionGenerator.js [options]
 * 
 * Options:
 *   --count=N       Number of sessions to generate (default: 300)
 *   --start=DATE    Start date in YYYY-MM-DD format (default: 2025-06-01)
 *   --end=DATE      End date in YYYY-MM-DD format (default: 2025-08-15)
 *   --output=PATH   Output directory path (default: ./playground)
 *   --db=PATH       Database path (default: auto-detect latest in ./temp_dbs)
 */

import parseArgs from 'minimist';
import fs from 'fs';
import path from 'path';
import process from 'process';
import Database from 'better-sqlite3';

const args = parseArgs(process.argv.slice(2));
const {
  count = 300,
  start = '2025-06-01',
  end = '2025-08-15',
  output = fs.existsSync(path.resolve('./playground')) ? './playground' : '../playground',
  db: dbPath
} = args;

const writeln = (...msg) => {
  console.log(...msg);
};

// Rate type distribution (weighted) - matches your database rate_types
const rateTypeWeights = [
  { id: 1, name: 'Home', weight: 50 },    // 50%
  { id: 2, name: 'DC', weight: 20 },      // 20%
  { id: 3, name: 'Other', weight: 15 },   // 15%
  { id: 4, name: 'Work', weight: 15 }     // 15%
];

function getLatestDatabasePath() {
  // Try both relative paths (for npm scripts from project root and direct execution from utilities/)
  const possiblePaths = ['./temp_dbs', '../temp_dbs'];
  
  for (const tempDbPath of possiblePaths) {
    const tempDbDir = path.resolve(tempDbPath);
    
    if (fs.existsSync(tempDbDir)) {
      const dbFiles = fs.readdirSync(tempDbDir)
        .filter(file => file.endsWith('.db'))
        .sort()
        .reverse(); // Get most recent first
      
      if (dbFiles.length > 0) {
        return path.join(tempDbDir, dbFiles[0]);
      }
    }
  }
  
  throw new Error(`temp_dbs directory not found. Tried: ${possiblePaths.join(', ')}`);
}

async function getVehiclesFromDatabase(dbPath) {
  let database;
  try {
    database = new Database(dbPath, { readonly: true });
    
    // Query vehicles from the actual database
    const vehicles = database.prepare(`
      SELECT 
        id,
        make,
        model,
        trim,
        battery_size,
        range,
        nickname
      FROM vehicles 
      ORDER BY id
    `).all();

    if (vehicles.length === 0) {
      throw new Error('No vehicles found in database. Please add some vehicles first.');
    }

    writeln(`Found ${vehicles.length} vehicles in database:`);
    vehicles.forEach(v => {
      const name = v.nickname || `${v.make} ${v.model}${v.trim ? ` ${v.trim}` : ''}`;
      const battery = v.battery_size ? `${v.battery_size} kWh` : 'Unknown capacity';
      writeln(`  ${v.id}: ${name} (${battery})`);
    });

    return vehicles.map(v => ({
      id: v.id,
      name: v.nickname || `${v.make} ${v.model}${v.trim ? ` ${v.trim}` : ''}`,
      battery_size: v.battery_size || 75, // Default if not specified
      typical_session_kwh: {
        min: Math.max(5, Math.round((v.battery_size || 75) * 0.1)),
        max: Math.round((v.battery_size || 75) * 0.8)
      }
    }));

  } finally {
    if (database) {
      database.close();
    }
  }
}

function weightedChoice(choices) {
  const total = choices.reduce((sum, choice) => sum + choice.weight, 0);
  const random = Math.random() * total;
  let accumulated = 0;
  
  for (const choice of choices) {
    accumulated += choice.weight;
    if (random <= accumulated) {
      return choice.id;
    }
  }
  return choices[0].id;
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function generateRandomDate(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  const randomTime = Math.random() * timeDiff;
  return new Date(start.getTime() + randomTime);
}

function generateRateOverride(rateTypeId) {
  // 10% chance of rate override
  if (Math.random() > 0.1) return null;
  
  switch (rateTypeId) {
    case 1: return +(randomBetween(0.08, 0.18).toFixed(3)); // Home
    case 2: return +(randomBetween(0.25, 0.45).toFixed(3)); // DC
    case 3: return +(randomBetween(0.08, 0.20).toFixed(3)); // Other
    case 4: return +(randomBetween(0.10, 0.25).toFixed(3)); // Work
    default: return null;
  }
}

function generateSessions(vehicles) {
  if (vehicles.length === 0) {
    throw new Error('No vehicles available for session generation');
  }

  const sessions = [];
  
  // Distribute sessions across vehicles based on realistic usage patterns
  // More active vehicles get more sessions
  const vehicleWeights = vehicles.map((v, index) => ({
    vehicle: v,
    weight: vehicles.length - index + Math.random() * 2 // Slight randomization
  }));
  
  for (let i = 1; i <= count; i++) {
    // Select vehicle using weighted distribution
    const totalWeight = vehicleWeights.reduce((sum, vw) => sum + vw.weight, 0);
    const random = Math.random() * totalWeight;
    let accumulated = 0;
    let selectedVehicle = vehicleWeights[0].vehicle;
    
    for (const vw of vehicleWeights) {
      accumulated += vw.weight;
      if (random <= accumulated) {
        selectedVehicle = vw.vehicle;
        break;
      }
    }
    
    // Random date within range
    const sessionDate = generateRandomDate(start, end);
    const dateStr = sessionDate.toISOString().split('T')[0];
    
    // Random rate type (weighted)
    const rateTypeId = weightedChoice(rateTypeWeights);
    
    // Random kWh based on vehicle's actual battery size
    const { min, max } = selectedVehicle.typical_session_kwh;
    const kwh = +(randomBetween(min, max).toFixed(2));
    
    // Optional rate override
    const rateOverride = generateRateOverride(rateTypeId);
    
    sessions.push({
      id: i,
      vehicle_id: selectedVehicle.id,
      rate_type_id: rateTypeId,
      date: dateStr,
      kwh: kwh,
      rate_override: rateOverride
    });
  }
  
  // Sort by date
  sessions.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Re-assign sequential IDs after sorting
  sessions.forEach((session, index) => {
    session.id = index + 1;
  });
  
  return sessions;
}

function outputCSV(sessions) {
  const csvContent = [
    'vehicle_id,rate_type_id,date,kwh,rate_override',
    ...sessions.map(session => 
      `${session.vehicle_id},${session.rate_type_id},${session.date},${session.kwh},${session.rate_override || ''}`
    )
  ].join('\n');

  const outputPath = path.resolve(output, 'sessions.csv');
  
  // Ensure directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  
  fs.writeFileSync(outputPath, csvContent);
  writeln(`\nCSV file written to: ${outputPath}`);
}

function printStatistics(sessions, vehicles) {
  // Vehicle distribution
  const vehicleStats = {};
  const rateTypeStats = {};
  
  sessions.forEach(session => {
    vehicleStats[session.vehicle_id] = (vehicleStats[session.vehicle_id] || 0) + 1;
    rateTypeStats[session.rate_type_id] = (rateTypeStats[session.rate_type_id] || 0) + 1;
  });
  
  writeln(`\n--- Statistics ---`);
  writeln(`Total sessions: ${sessions.length}`);
  writeln(`Date range: ${sessions[0].date} to ${sessions[sessions.length - 1].date}`);
  
  writeln(`\nSessions per vehicle:`);
  Object.entries(vehicleStats).forEach(([vid, count]) => {
    const vehicle = vehicles.find(v => v.id === parseInt(vid));
    writeln(`  Vehicle ${vid} (${vehicle.name}): ${count} sessions`);
  });
  
  writeln(`\nSessions per rate type:`);
  Object.entries(rateTypeStats).forEach(([rid, count]) => {
    const rateType = rateTypeWeights.find(r => r.id === parseInt(rid));
    writeln(`  ${rateType.name}: ${count} sessions`);
  });

  // kWh statistics
  const kwhValues = sessions.map(s => s.kwh);
  const totalKwh = kwhValues.reduce((sum, kwh) => sum + kwh, 0);
  const avgKwh = totalKwh / kwhValues.length;
  writeln(`\nEnergy statistics:`);
  writeln(`  Total kWh: ${totalKwh.toFixed(2)}`);
  writeln(`  Average per session: ${avgKwh.toFixed(2)} kWh`);
}

try {
  const databasePath = dbPath ? path.resolve(dbPath) : getLatestDatabasePath();
  writeln(`Using database: ${databasePath}`);
  
  writeln(`\nLoading vehicles from database...`);
  const vehicles = await getVehiclesFromDatabase(databasePath);
  
  writeln(`\nGenerating ${count} sessions from ${start} to ${end}...`);
  const sessions = generateSessions(vehicles);
  
  outputCSV(sessions);
  printStatistics(sessions, vehicles);
  
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
