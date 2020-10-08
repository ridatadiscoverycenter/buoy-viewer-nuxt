import embed from 'vega-embed';

const vegaBaseMixin = {
  props: {
    id: {
      type: String,
      required: true
    },
    dataset: {
      type: Array,
      required: true
    },
    minWidth: {
      type: Number,
      required: false,
      default: 200
    },
    includeActions: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  computed: {
    actionsWidth() {
      return this.includeActions ? 28 : 0;
    }
  },
  watch: {
    dataset(newVal, oldValue) {
      this.updatePlot();
    },
    variable(newValue, oldValue) {
      this.updatePlot();
    }
  },
  data() {
    return {
      view: null
    };
  },
  mounted() {
    this.updatePlot();

    this.$nextTick(() => {
      window.addEventListener('resize', this.resizePlot);
    });
  },
  updated() {
    this.updatePlot();
  },
  beforeDestory() {
    if (this.view) {
      this.view.finalize();
      window.removeEventListener('resize', this.resizePlot);
    }
  },
  methods: {
    getWidth() {
      const el = document.querySelector('#' + this.id);
      const p = el.closest('.chart');
      return Math.max(this.minWidth, p.clientWidth) - this.actionsWidth;
    },
    updatePlot() {
      embed('#' + this.id, this.spec, {
        actions: this.includeActions,
        theme: 'vox',
        renderer: 'svg',
        config: {
          width: this.getWidth(),
          autosize: 'fit'
        },
        logLevel: 3
      }).then((res) => {
        this.view = res.view;
      });
    },
    resizePlot() {
      if (this.view) {
        this.view
          .width(this.getWidth())
          .resize()
          .runAsync();
      }
    }
  }
};

export default vegaBaseMixin;
