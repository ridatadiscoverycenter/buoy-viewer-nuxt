<template>
  <svg></svg>
</template>
<script>
import * as d3 from 'd3';

export default {
  props: {
    dataset: {
      type: [Array, Object],
      required: true
    },
    x: {
      type: String,
      default: 'x'
    },
    y: {
      type: String,
      default: 'y'
    }
  },
  data() {
    return {
      margin: { top: 10, bottom: 60, left: 10, right: 60 },
      height: 200,
      width: 200
    };
  },
  computed: {
    line() {
      return d3
        .line()
        .x((d) => this.xScale(d[this.x]) + this.xScale.bandwidth() / 2)
        .y((d) => this.yScale(d[this.y]));
    },
    xScale() {
      return d3
        .scaleBand()
        .domain(this.dataset.map((d) => d[this.x]))
        .rangeRound([this.margin.left, this.width - this.margin.right])
        .padding(0.1);
    },
    yScale() {
      return d3
        .scaleLinear()
        .domain([0, d3.max(this.dataset, (d) => d[this.y])])
        .rangeRound([this.height - this.margin.bottom, this.margin.top]);
    },
    xAxis() {
      return d3.axisBottom(this.xScale);
    },
    yAxis() {
      return d3.axisLeft(this.yScale).ticks(null, 's');
    }
  },
  watch: {
    dataset(newValue, oldValue) {
      this.updatePlot();
    }
  },
  mounted() {
    this.plot();
  },
  methods: {
    updatePlot() {
      d3.select(`#${this.$attrs.id}`)
        .select('.line')
        .transition()
        .attr('d', this.line(this.dataset));

      d3.select('.x-ticks-line')
        .transition()
        .call(this.xAxis);

      d3.select('.y-ticks-line')
        .transition()
        .call(this.yAxis);
    },
    plot() {
      const svg = d3
        .select(`#${this.$attrs.id}`)
        .attr('viewBox', [0, 0, this.width, this.height]);
      const g = svg.append('g');

      g.append('path')
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', 'currentColor')
        .attr('stroke-miterlimit', 1)
        .attr('stroke-width', 2)
        .attr('stroke-linejoin', 'round')
        .attr('d', this.line(this.dataset));

      g.append('g')
        .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
        .attr('class', 'x-ticks-line')
        .call(this.xAxis);

      svg
        .append('g')
        .attr('transform', `translate(${this.margin.left},0)`)
        .attr('class', 'y-ticks-line')
        .call(this.yAxis);
      return svg;
    }
  }
};
</script>
<style lang="scss">
@import 'bulma';
.x-ticks-line,
.y-ticks-line {
  font-size: 0.3rem;
}
.line {
  color: $info;
}
</style>
