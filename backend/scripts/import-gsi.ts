import { readFile, writeFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";
import { z } from "zod";
import { destinationSchema } from "../src/schemas/destination.js";
const [input, output] = process.argv.slice(2);
if (!input || !output)
  throw new Error(
    "Usage: npm run import:gsi --workspace backend -- input.csv output.json (UTF-8 emergency-site CSV)",
  );
const rows = z.array(z.record(z.string(), z.string())).parse(
  parse(await readFile(input, "utf8"), {
    columns: true,
    bom: true,
    skip_empty_lines: true,
  }),
);
const hazards = {
  洪水: "flood",
  "崖崩れ、土石流及び地滑り": "landslide",
  高潮: "stormSurge",
  地震: "earthquake",
  津波: "tsunami",
  大規模な火事: "fire",
  内水氾濫: "inlandFlood",
  火山現象: "volcano",
} as const;
for (const row of rows) {
  for (const key of [
    "共通ID",
    "施設・場所名",
    "住所",
    "緯度",
    "経度",
    ...Object.keys(hazards),
  ]) {
    if (!(key in row))
      throw new Error(
        `Missing CSV column: ${key}. Check the GSI export headers.`,
      );
  }
  if (!row["緯度"]?.trim() || !row["経度"]?.trim())
    throw new Error("Missing coordinates");
}
const records = rows.map((row) =>
  destinationSchema.parse({
    id: row["共通ID"],
    name: row["施設・場所名"],
    address: row["住所"],
    latitude: Number(row["緯度"]),
    longitude: Number(row["経度"]),
    disasters: Object.entries(hazards)
      .filter(([key]) => ["1", "○", "◯"].includes(row[key]?.trim() ?? ""))
      .map(([, value]) => value),
    kind: "emergencySite",
    source: "GSI designated emergency evacuation sites",
    verifiedAt: null,
    isDemo: false,
    openingStatus: "unknown",
  }),
);
if (new Set(records.map((record) => record.id)).size !== records.length)
  throw new Error("Duplicate site IDs; reconcile records before importing");
await writeFile(output, JSON.stringify(records, null, 2) + "\n", {
  flag: "wx",
});
console.info(
  `Wrote ${records.length} records. Review designations and entrances before use.`,
);
