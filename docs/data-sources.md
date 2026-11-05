# Data provenance

The committed JSON is fictional sample content. It is not imported GSI data,
not a verified walking route, and not an operational evacuation recommendation.
The location may overlap real streets; that does not imply access or suitability.

Official data entry points:

- GSI overview: https://www.gsi.go.jp/bousaichiri/hinanbasho.html
- Download and conditions: https://hinanmap.gsi.go.jp/index.html
- CSV fields: https://hinanmap.gsi.go.jp/hinanjocp/hinanbasho/koukaidate.html

For real data, preserve IDs, source, retrieval dates, disaster suitability, and the
emergency-site/shelter distinction. Designation does not establish opening status.
A facility point does not establish a pedestrian entrance or safe approach route.
Review attribution/usage conditions and municipality updates before distributing.

## Import helper

Download a UTF-8 emergency-site CSV and inspect its headers. The helper expects
the common-ID, name, address, coordinates, and eight hazard columns shown in the
GSI CSV definition. It rejects missing columns/coordinates and duplicate IDs;
it writes a new output file only, so importing cannot silently overwrite fixtures.
Hazard values 1, ○, and ◯ are recognized. Review differing export conventions.

```sh
npm run import:gsi --workspace backend -- /absolute/path/input.csv /absolute/path/reviewed-sites.json
```

Review the generated file before replacing backend/data/destinations.json. Importing
sites does not generate routes or validate entrances. Replace synthetic routes
separately with surveyed waypoints and a verification date. Current route support
is limited to a small radius around each saved route's starting waypoint.
