export default {
  target: 'static',
  ssr: false,
  components: true,
  router: {
    base: '/',
  },
  /*
   ** Headers of the page
   */
  head: {
    title: 'Narragansett Bay Data Explorer',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Explore historical and real-time data about water quality, temperature, and more from the Narragansett Bay.',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: '~/components/loading.vue',
  /*
   ** Global CSS
   */
  css: [
    './node_modules/bulma-slider/dist/css/bulma-slider.min',
    '~/assets/styles/main.scss',
    './node_modules/vue-multiselect/dist/vue-multiselect.min.css',
    './node_modules/vue2-datepicker/index.css',
    './node_modules/mapbox-gl/dist/mapbox-gl.css',
    './node_modules/vue-mapbox/dist/vue-mapbox.css',
  ],
  styleResources: {
    scss: '~assets/styles/main.scss',
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{ src: '~/plugins/mapbox', mode: 'client' }],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://google-analytics.nuxtjs.org/setup
    '@nuxtjs/google-analytics',
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    // SVG Loader
    '@nuxtjs/svg',
    // https://www.npmjs.com/package/@nuxtjs/style-resources
    '@nuxtjs/style-resources',
    [
      '@nuxtjs/fontawesome',
      {
        component: 'fa',
        icons: {
          solid: [
            'faArrowLeft',
            'faBars',
            'faChartArea',
            'faCompass',
            'faDatabase',
            'faExclamationCircle',
            'faHome',
            'faInfoCircle',
            'faLifeRing',
            'faPoll',
            'faTimes',
            'faWater',
          ],
        },
      },
    ],
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL:
      process.env.RIDDC_API_BASEURL || 'https://api.riddc.brown.edu/erddap',
    headers: {
      common: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  },

  googleAnalytics: {
    id: 'UA-191457907-1',
  },

  /*
   ** Build configuration
   */
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false,
        },
      },
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
};
