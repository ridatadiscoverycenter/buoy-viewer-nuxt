# [Narragansett Bay Data Explorer](https://data-explorer.riddc.brown.edu)

[![DOI](https://zenodo.org/badge/271652303.svg)](https://zenodo.org/badge/latestdoi/271652303)

> Explore data from the [RI Data Discovery Center](https://ridatadiscovery.org) about the Narragansett Bay.

## Build Setup

For the map in the domoic acid page to work, you'll need a .env file with the following keys:
```
VUE_APP_MAPBOX_ACCESS_TOKEN=
```

Node version: 14

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
