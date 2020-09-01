<template>
  <div class="plot-container">
    <div id="viz"></div>
  </div>
</template>

<script>
import vega from 'vega-embed';
import topojson from '@/static/ri.json';

export default {
  data() {
    return {
      topo: topojson,
      buoys: [
        {
          label: 'SP',
          BART_label: 'B1',
          name: 'South Prudence',
          operator: 'URI/GSO',
          owner: 'URI/GSO',
          station_type: 'Buoy',
          status: 'Not active',
          dates_stabilisehd: '2001-2002',
          season: 'extended season',
          latitude: 41.5911,
          longitude: -71.3426
        },
        {
          label: 'NP',
          BART_label: 'B2',
          name: 'North Prudence',
          operator: 'URI/GSO',
          owner: 'RI DEM-OWR',
          station_type: 'Buoy',
          status: 'Active',
          dates_stabilisehd: '1999, 2001-present',
          season: 'Summer seasonal (may-oct)',
          latitude: 41.6708,
          longitude: -71.3549
        },
        {
          label: 'CP',
          BART_label: 'B3',
          name: 'Conimicut Pt',
          operator: 'URI/GSO',
          owner: 'RI DEM-OWR',
          station_type: 'Buoy',
          status: 'Active',
          dates_stabilisehd: '2003, 2005-present',
          season: 'Summer seasonal (may-oct)',
          latitude: 41.7128,
          longitude: -71.3437
        },
        {
          label: 'UB',
          BART_label: 'B3W',
          name: 'Winter Station',
          operator: 'URI/GSO',
          owner: 'URI/GSO',
          station_type: 'Buoy',
          status: 'Active',
          dates_stabilisehd: '2008-present (winter only)',
          season: 'winter season only',
          latitude: 41.7115,
          longitude: -71.3379
        },
        {
          label: 'BR',
          BART_label: 'B4',
          name: 'Bullocks Reach',
          operator: 'NBC',
          owner: 'NBC',
          station_type: 'Buoy',
          status: 'Active',
          dates_stabilisehd: '2001-present',
          season: 'Summer seasonal (may-oct)',
          latitude: 41.731,
          longitude: -71.3653
        },
        {
          label: 'MV',
          BART_label: 'B6',
          name: 'Mt View',
          operator: 'URI/GSO',
          owner: 'RI DEM-OWR',
          station_type: 'Buoy',
          status: 'Active',
          dates_stabilisehd: '2004-present',
          season: 'Summer seasonal (may-oct)',
          latitude: 41.6385,
          longitude: -71.3909
        },
        {
          label: 'QP',
          BART_label: 'B7',
          name: 'Quonset Pt',
          operator: 'URI/GSO',
          owner: 'RI DEM-OWR',
          station_type: 'Buoy',
          status: 'Active',
          dates_stabilisehd: '2005-present',
          season: 'Summer seasonal (may-oct)',
          latitude: 41.5903,
          longitude: -71.38
        },
        {
          label: 'MH',
          BART_label: 'B12',
          name: 'Mt Hope Bay',
          operator: 'URI/GSO',
          owner: 'RI DEM-OWR',
          station_type: 'Buoy',
          status: 'Active',
          dates_stabilisehd: '2005-present',
          season: 'Summer seasonal (may-oct)',
          latitude: 41.6799,
          longitude: -71.2156
        },
        {
          label: 'PP',
          BART_label: 'B13',
          name: 'Poppasquash Pt',
          operator: 'URI/GSO',
          owner: 'RI DEM-OWR',
          station_type: 'Buoy',
          status: 'Active',
          dates_stabilisehd: '2004-present',
          season: 'Summer seasonal (may-oct)',
          latitude: 41.6492,
          longitude: -71.3181
        },
        {
          label: 'SR',
          BART_label: 'B14',
          name: 'Sally Rock',
          operator: 'URI/GSO',
          owner: 'RI DEM-OWR',
          station_type: 'Buoy',
          status: 'Active',
          dates_stabilisehd: '2008-present',
          season: 'Summer seasonal (may-oct)',
          latitude: 41.676,
          longitude: -71.4243
        },
        {
          label: 'TW',
          BART_label: 'F3',
          name: 'T-Wharf',
          operator: 'NBNERR',
          owner: 'NBNERR',
          station_type: 'Land/Dock',
          status: 'Active',
          dates_stabilisehd: '2004-present',
          season: 'year round',
          latitude: 41.5789,
          longitude: -71.3215
        },
        {
          label: 'PD',
          BART_label: 'F4',
          name: 'Phillipsdale',
          operator: 'NBC',
          owner: 'NBC',
          station_type: 'Land/Dock',
          status: 'Active',
          dates_stabilisehd: '2004-present',
          season: 'extended season',
          latitude: 41.8418,
          longitude: -71.372
        },
        {
          label: 'GB',
          BART_label: 'F5',
          name: 'Greenwich Bay',
          operator: 'URI/GSO',
          owner: 'RI DEM-OWR',
          station_type: 'Land/Dock',
          status: 'Active',
          dates_stabilisehd: '2009-present',
          season: 'seasonal',
          latitude: 41.6861,
          longitude: -71.4459
        },
        {
          label: 'PC',
          BART_label: 'F6',
          name: 'Potters Cove',
          operator: 'NBNERR',
          owner: 'NBNERR',
          station_type: 'Land/Dock',
          status: 'Active',
          dates_stabilisehd: '1995-present',
          season: 'extended season',
          latitude: 41.6406,
          longitude: -71.3411
        },
        {
          label: 'GD',
          BART_label: 'F7',
          name: 'GSO Dock',
          operator: 'URI/GSO',
          owner: 'URI/GSO',
          station_type: 'Land/Dock',
          status: 'Active',
          dates_stabilisehd: '1995-present',
          season: 'year round',
          latitude: 41.4922,
          longitude: -71.4189
        },
        {
          label: 'CR',
          BART_label: 'CR',
          name: 'Cole River',
          operator: 'URI/GSO',
          owner: 'MA DEP',
          station_type: 'Buoy',
          status: 'Active',
          dates_stabilisehd: '2016-present',
          season: 'seasonal',
          latitude: 41.7015,
          longitude: -71.2154
        },
        {
          label: 'TR',
          BART_label: 'TR',
          name: 'Taunton River',
          operator: 'URI/GSO',
          owner: 'MA DEP',
          station_type: 'Buoy',
          status: 'Active',
          dates_stabilisehd: '2016-present',
          season: 'seasonal',
          latitude: 41.7009,
          longitude: -71.1877
        },
        {
          label: 'GB-old',
          BART_label: 'F5-old',
          name: 'Greenwich Bay',
          operator: 'NBNERR, URI/GSO',
          owner: 'RI DEM-OWR',
          station_type: 'Land/Dock',
          status: 'Not active',
          dates_stabilisehd: '2004-2006 (seasonal) 2007-2008 year round',
          season: 'seasonal, year round',
          latitude: 41.6848,
          longitude: -71.446
        }
      ]
    };
  },
  computed: {
    spec() {
      return {
        $schema: 'https://vega.github.io/schema/vega/v5.json',
        width: 600,
        height: 700,
        autosize: 'none',

        data: [
          {
            name: 'outlines',
            values: this.topo,
            format: { type: 'topojson', feature: 'ri' }
          },
          {
            name: 'buoys',
            values: this.buoys,
            format: { type: 'json', parse: 'auto' },
            transform: [
              {
                type: 'geopoint',
                projection: 'projection',
                fields: ['longitude', 'latitude']
              }
            ]
          }
        ],
        projections: [
          {
            name: 'projection',
            type: 'mercator',
            scale: 30000,
            center: [-71.1774, 41.6801]
          }
        ],
        marks: [
          {
            type: 'shape',
            from: { data: 'outlines' },
            encode: {
              enter: {
                strokeWidth: { value: 1 },
                stroke: { value: '#bbb' }
              }
            },
            transform: [{ type: 'geoshape', projection: 'projection' }]
          },
          {
            type: 'symbol',
            from: { data: 'buoys' },
            encode: {
              enter: {
                size: { value: 100 },
                stroke: { value: 'steelblue' },
                fill: { value: 'steelblue' },
                tooltip: {
                  signal: 'datum'
                }
              },
              update: {
                x: { field: 'x' },
                y: { field: 'y' }
              }
            }
          }
        ]
      };
    }
  },
  mounted() {
    vega('#viz', this.spec, { actions: true, theme: 'vox', renderer: 'svg' });
  },
  updated() {
    vega('#viz', this.spec, { actions: true, theme: 'vox', renderer: 'svg' });
  }
};
</script>

<style lang="scss" scoped>
.plot-container {
  margin-top: 5rem;
}
.marks {
  background-color: 'aliceblue';
}
</style>
