export default {
  server: {
    port: 8081
  },
  ssr: true,
  components: true,
  router: {
    base: '/'
  },
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: '~/components/loading.vue',
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    '@nuxtjs/moment',
    [
      '@nuxtjs/fontawesome',
      {
        component: 'fa',
        icons: {
          solid: [
            'faAngleLeft',
            'faMapMarkerAlt',
            'faCalendarAlt',
            'faSpinner',
            'faPlayCircle',
            'faCompass',
            'faChartArea',
            'faDownload',
            'faArrowLeft',
            'faHome',
            'faBars',
            'faInfoCircle'
          ]
        },
        proIcons: {
          regular: [
            'faHome',
            'faInfoCircle',
            'faDatabase',
            'faToolbox',
            'faPoll',
            'faArrowLeft',
            'faArrowRight',
            'faCircle',
            'faTimes',
            'faBars'
          ],
          duotone: ['faLifeRing']
        }
      }
    ]
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/bulma',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    // SVG Loader
    'nuxt-svg-loader'
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
        'Content-Type': 'application/json'
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
};
