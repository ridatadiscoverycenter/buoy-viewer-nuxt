<<<<<<< HEAD
<<<<<<< HEAD
# [Narragansett Bay Data Explorer](https://data-explorer.riddc.brown.edu)

[![DOI](https://zenodo.org/badge/271652303.svg)](https://zenodo.org/badge/latestdoi/271652303)

> Explore data from the [RI Data Discovery Center](https://ridatadiscovery.org) about the Narragansett Bay.
=======
# Narragansett Bay Data Explorer

A web app to explore data about the Narragansett bay.  Built using Nuxt (vue).  Uses the buoy-api as a backend.
>>>>>>> feat: stub out fish trawl
=======
# Narragansett Bay Data Explorer

A web app to explore data about the Narragansett bay.  Built using Nuxt (vue).  Uses the buoy-api as a backend.
>>>>>>> 86ce104aa065d2883d91a4e5ce566cb6ed2b3862

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
$ yarn dev # connect to production api
$ yarn dev:local # connect to locally running api

# linting
$ yarn lint # report linting errors
$ yarn lint:fix # fix linting errors if possible

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
