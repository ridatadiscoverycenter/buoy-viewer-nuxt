# [Narragansett Bay Data Explorer](https://data-explorer.riddc.brown.edu)

[![DOI](https://zenodo.org/badge/271652303.svg)](https://zenodo.org/badge/latestdoi/271652303)

> Explore data from the [RI Data Discovery Center](https://ridatadiscovery.org) about the Narragansett Bay.

## Build Setup

For the map in the domoic acid page to work, you'll need a .env file with the following keys:
```
NUXT_ENV_MAPBOX_ACCESS_TOKEN=
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


## Generating Static Files and its Dynamic API Call implications
`yarn generate` configures our web application as a static web application. During this process, it generates every route as an HTML file and exports it to the `dist/` directory. This process raises a concern whether our dynamic content gets baked in/cached within the built site. 

The theory for why the dynamic contect for this project continue to work is that we generally make our API calls in the store actions and retrieve data from the store. Nuxt isn't able to bake the results of these calls and keeps them as javascript. 

:warning: Check whether your API calls are still going out in the built and deployed app. 

For more resources, check out [NuxtJS Blog: Going Full Static](https://nuxtjs.org/blog/going-full-static), [Nuxt lifecycle](https://nuxtjs.org/docs/2.x/concepts/nuxt-lifecycle), and [NuxtJS Docs: Store directory](https://nuxtjs.org/docs/2.x/directory-structure/store).
