import vega from 'vega-embed';

const vegaBaseMixin = {
  props: {
    id: {
      type: String,
      required: true
    },
    dataset: {
      type: Array,
      required: true
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
  mounted() {
    this.updatePlot();
  },
  updated() {
    this.updatePlot();
  },
  methods: {
    updatePlot() {
      vega('#' + this.id, this.spec, {
        actions: true,
        theme: 'vox',
        renderer: 'svg'
      });
    }
  }
};

export default vegaBaseMixin;
