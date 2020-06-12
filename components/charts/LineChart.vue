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
  mounted() {
    this.plot();
  },
  methods: {
    plot() {
      const id = this.$attrs.id;
      const margin = { top: 10, bottom: 60, left: 10, right: 60 };
      const height = 200;
      const width = 200;
      const x = d3
        .scaleBand()
        .domain(this.dataset.map((d) => d[this.x]))
        .rangeRound([margin.left, width - margin.right])
        .padding(0.1);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(this.dataset, (d) => d[this.y])])
        .rangeRound([height - margin.bottom, margin.top]);

      const line = d3
        .line()
        .x((d) => x(d[this.x]) + x.bandwidth() / 2)
        .y((d) => y(d[this.y]));

      const svg = d3.select(`#${id}`).attr('viewBox', [0, 0, width, height]);
      const g = svg.append('g');

      g.append('path')
        .attr('fill', 'none')
        .attr('stroke', 'currentColor')
        .attr('stroke-miterlimit', 1)
        .attr('stroke-width', 3)
        .attr('d', line(this.dataset));

      const xAxis = d3
        .axisBottom(x)
        .tickValues(
          d3
            .ticks(...d3.extent(x.domain()), this.dataset.length)
            .filter((v) => x(v) !== undefined)
        )
        .tickSizeOuter(0);

      g.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .attr('class', 'x-ticks')
        .call(xAxis);

      const yAxis = (g) =>
        g
          .attr('transform', `translate(${margin.left},0)`)
          .attr('class', 'y-ticks')
          .call(d3.axisLeft(y).ticks(null, 's'))
          .call((g) => g.select('.domain').remove())
          .call((g) =>
            g
              .append('text')
              .attr('x', -margin.left)
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
<style lang="scss"></style>
