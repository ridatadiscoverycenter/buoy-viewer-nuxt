<template>
  <svg></svg>
</template>
<script>
import * as d3 from 'd3';
export default {
  props: {
    dataset: {
      type: Array,
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
      return d3
        .axisBottom(this.xScale)
        .tickValues(
          d3
            .ticks(...d3.extent(this.xScale.domain()), this.dataset.length)
            .filter((v) => this.xScale(v) !== undefined)
        )
        .tickSizeOuter(0);
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
      const svg = d3.select(`#${this.$attrs.id}`).select('g');

      svg
        .selectAll('rect')
        .data(this.dataset)
        .join('rect')
        .transition()
        .attr('x', (d) => this.xScale(d[this.x]))
        .attr('y', (d) => this.yScale(d[this.y]))
        .attr('width', this.xScale.bandwidth())
        .attr('height', (d) => this.yScale(0) - this.yScale(d[this.y]))
        .attr('class', 'rect');

      d3.select('.x-ticks')
        .transition()
        .call(this.xAxis);
    },
    plot() {
      const svg = d3
        .select(`#${this.$attrs.id}`)
        .attr('viewBox', [0, 0, this.width, this.height]);
      const g = svg.append('g');

      g.selectAll('rect')
        .data(this.dataset)
        .join('rect')
        .attr('x', (d) => this.xScale(d[this.x]))
        .attr('y', (d) => this.yScale(d[this.y]))
        .attr('width', this.xScale.bandwidth())
        .attr('height', (d) => this.yScale(0) - this.yScale(d[this.y]))
        .attr('class', 'rect');

      g.append('g')
        .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
        .attr('class', 'x-ticks')
        .call(this.xAxis);

      const yAxis = (g) =>
        g
          .attr('transform', `translate(${this.margin.left},0)`)
          .attr('class', 'y-ticks')
          .call(d3.axisLeft(this.yScale).ticks(null, 's'))
          .call((g) => g.select('.domain').remove())
          .call((g) =>
            g
              .append('text')
              .attr('x', -this.margin.left)
              .attr('y', 10)
              .attr('fill', 'currentColor')
              .attr('text-anchor', 'start')
              .text(this.dataset[this.y])
          );

      svg.append('g').call(yAxis);
      return svg;
    }
  }
};
</script>
<style lang="scss">
@import 'bulma';
.rect {
  fill: $link;
}
.x-ticks,
.y-ticks {
  font-size: 0.3rem;
}
</style>
