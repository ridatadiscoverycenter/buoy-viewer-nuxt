#!/bin/bash

# data from https://shoreline.noaa.gov/data/datasheets/medres.html
shp2json -n ~/Downloads/us_medium_shoreline/us_medium_shoreline.shp \
  | ndjson-filter "['M', 'N'].includes(d.properties.REGIONS)&& d.geometry.coordinates[0][0] > -71.6 && d.geometry.coordinates[0][0] < -71 && d.geometry.coordinates[0][1] > 39 && d.geometry.coordinates[0][1] < 42" \
  | ndjson-reduce 'p.features.push(d), p' '{type: "FeatureCollection", features: []}' \
> static/ri_coast.json
