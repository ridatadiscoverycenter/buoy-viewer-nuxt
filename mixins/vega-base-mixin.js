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
      view: null,
      resizeObserver: null,
      parentElement: null
    };
  },
  mounted() {
    const el = document.querySelector('#' + this.id);
    this.parentElement = el.closest('.chart');

    this.updatePlot();

    this.$nextTick(() => {
      this.resizeObserver = new ResizeObserver((_) => this.resizePlot());
      this.resizeObserver.observe(this.parentElement);
    });
  },
  updated() {
    this.updatePlot();
  },
  beforeDestory() {
    if (this.view) {
      this.view.finalize();
      this.resizeObserver.unobserve(this.parentElement);
    }
  },
  methods: {
    getWidth() {
      return (
        Math.max(this.minWidth, this.parentElement.clientWidth) -
        this.actionsWidth
      );
    },
    updatePlot() {
      if (this.view) {
        this.view.finalize();
      }
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
