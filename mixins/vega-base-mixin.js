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
    maxWidth: {
      type: Number,
      required: false,
      default: 800
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
      return Math.min(this.maxWidth, el.clientWidth);
    },
    updatePlot() {
      embed('#' + this.id, this.spec, {
        actions: true,
        theme: 'vox',
        renderer: 'svg',
        config: {
          width: this.getWidth(),
          autosize: 'fit'
        },
        logLevel: 'vega.Info'
      }).then((res) => {
        this.view = res.view;
      });
    },
    resizePlot() {
      if (this.view) {
        this.view.width(this.getWidth());
        this.view.resize();
        this.view.runAsync();
      }
    }
  }
};

export default vegaBaseMixin;
