// seedStations.js
const mongoose = require("mongoose");
require("dotenv").config();

const Station = require("./models/Station"); // adjust path if needed

const API_URL = "https://data.calgary.ca/resource/2axz-xm4q.json?$limit=100";

function deriveLine(route) {
  if (route === "201/202") return "Both";
  if (route === "201") return "Red";
  if (route === "202") return "Blue";
  return null;
}

function cleanName(raw) {
  return raw.replace(/\s+Station$/i, "").trim();
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();

  const current = data.filter((s) => s.status === "Current");
  console.log(
    `Fetched ${current.length} current stations from Calgary Open Data`,
  );

  // Wipe the collection
  await Station.deleteMany({});
  console.log("Dropped existing stations");

  const toInsert = [];

  for (const s of current) {
    if (!s.the_geom?.coordinates || !s.stationnam || !s.route) {
      console.warn(`Skipping incomplete record:`, s.stationnam);
      continue;
    }

    const line = deriveLine(s.route);
    if (!line) {
      console.warn(`Unknown route "${s.route}" for ${s.stationnam}, skipping`);
      continue;
    }

    const [lng, lat] = s.the_geom.coordinates;
    const name = cleanName(s.stationnam);

    toInsert.push({ name, line, coordinates: { lat, lng } });
  }

  // Deduplicate — keep first occurrence of each name
  const seen = new Set();
  const deduped = toInsert.filter((s) => {
    if (seen.has(s.name)) {
      console.log(`Skipping duplicate: ${s.name}`);
      return false;
    }
    seen.add(s.name);
    return true;
  });

  const inserted = await Station.insertMany(deduped);
  console.log(`\nDone — ${inserted.length} stations inserted`);
  inserted.forEach((s) => console.log(`  [${s.line}] ${s.name}`));

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
