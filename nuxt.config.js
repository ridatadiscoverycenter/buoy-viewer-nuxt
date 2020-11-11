export default {
  ssr: true,
  components: true,
  router: {
    base: '/narrbay_explorer/'
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
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: '~/components/loading.vue',
  /*
   ** Global CSS
   */
  css: ['@brown-ccv/disco-styles'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{ src: '~/plugins/web-worker.js', ssr: false }],
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
            'faBars'
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
    baseURL: 'https://pricaimcit.services.brown.edu/erddap/tabledap',
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
    extend(config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          test: /\.worker\.js$/,
          loader: 'worker-loader',
          exclude: /(node_modules)/
        });
      }
    }
  }
};
