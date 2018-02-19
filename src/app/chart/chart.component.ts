import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { selectAll, select, selection } from 'd3-selection';
import { scaleOrdinal, scaleLinear, scaleSqrt, schemeCategory10 } from 'd3-scale';
import { axisLeft, axisBottom } from 'd3-axis';
import 'd3-transition';
import { format } from 'd3-format';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() bioData;
  backgroundCircles = [13, 16, 17, 19, 20, 7, 26, 28, 29, 30];

  constructor() { }

  ngOnInit() {
    console.log('bd', this.bioData);
    // this.drawChart();
    selection.prototype.moveToFront = function() {
      return this.each(function() {
        this.parentNode.appendChild(this);
      });
    };
    selection.prototype.moveToBack = function() {
        return this.each(function() {
            const firstChild = this.parentNode.firstChild;
            if (firstChild) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });
    };
  }

  ngOnChanges() {
    console.log('bd', this.bioData);
    if (this.bioData) {
      this.drawChart();
    }
  }

  drawChart() {

    // Chart dimensions.
    const margin = {top: 100, right: 200, bottom: 100, left: 200},
    width = 1500 - margin.right - margin.left,
    height = 900 - margin.top - margin.bottom;


    // Create the SVG container and set the origin.
    const svg = select('#chart-container').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Various scales. These domains make assumptions of data.
    const yScale = scaleOrdinal().domain(['Free-Living (Open)', 'Free-Living (Island)', 'Free-Living (Closed)', '', 'Penned'])
    .range([0, height / 4,  height / 2, 5.5 * height / 8, 7 * height / 8, height]),
    xScale = scaleLinear().domain([100, 0]).range([width, 0]),
    radiusScale = scaleSqrt().domain([0, 353]).range([10, 100]),
    borderScale = scaleSqrt().domain([0, 13]).range([0, 10]),
    colorScale = scaleOrdinal().domain(['PZP', 'GnRH']).range(['#52AEEE', '#F1A52D']);

    const xAxis = axisBottom().scale(xScale),
    yAxis = axisLeft().scale(yScale);

    // Add the x-axis.
    svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

    // Add the y-axis.
    svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

    // Add an x-axis label.
    svg.append('text')
    .attr('class', 'x-label')
    .attr('text-anchor', 'end')
    .attr('x', width / 2)
    .attr('y', height + 50)
    .text('Efficacy (%)');

    // Add a y-axis label.
    svg.append('text')
    .attr('class', 'y label')
    .attr('text-anchor', 'end')
    .attr('y', -60)
    .attr('dy', '-5em')
    .attr('x', -height / 2)
    .attr('transform', 'rotate(-90)')
    .text('Realism');

    const dotGroup = svg.append('g');

    // Add a dot per study.
    const dots = dotGroup.selectAll('circle')
        .data(this.bioData);

    console.log('biodata', this.bioData.sort(this.order));

    dots
    .enter().append('circle')
    .attr('class', 'dot')
    .attr('id', function(d) { return'circle' + d.id; })
    .attr('cx', function(d) { return xScale(+d.Efficacy); })
    .attr('cy', function(d) { return yScale(d.Realism); })
    .attr('r', function(d) { return radiusScale(+d.Population); })
    .style('fill', function(d) { return colorScale(d.Type); })
    .style('opacity', 0.8)
    .style('stroke', 'black')
    .style('stroke-width', function(d) { return borderScale(+d.Length); })
    .on('mouseover', handleMouseOver)
    .on('mouseout', handleMouseOut)
    .append('title')
    .text(function(d) { return d.Study + ': ' + d.Species; })
    ;

    dots.enter().insert('foreignObject')
      .attr('id', function(d) {
        return 'title_' + d.id;
      })
      .attr('x', function(d) { return  xScale(+d.Efficacy); })
      .attr('y', function(d) { return yScale(d.Realism); })
      .attr('width', function(d) {
        return 2 * radiusScale(+d.Population) * Math.cos(Math.PI / 4);
      })
      .attr('height', function(d) {
        return 2 * radiusScale(+d.Population) * Math.cos(Math.PI / 4);
      })
      .attr('transform', function(d) {
        const dx = -(radiusScale(+d.Population) * Math.cos(Math.PI / 4));
        return 'translate(' + [dx, dx] + ')';
      })
      .append('xhtml:div')
      .attr('id', function(d) {
        return 'html_' + d.id;
      })
      .attr('class', 'html-class')
      .html(function(d) { return d.Species;})
      .style('line-height', '105%')
      .style('text-align', 'center')
      .style('color', 'white')
      .style('margin-top', function(d) {
        const parentHeight = -(radiusScale(+d.Population) * Math.cos(Math.PI / 4));
        const dy = -(parentHeight) - (this.getBoundingClientRect().height/2);
        return dy + 'px';
      })
      .style('opacity', d => {
        if ( this.backgroundCircles.indexOf(+d.id) === -1){
          return 1;
        } else {
          return 0;
        }
      });

      function handleMouseOver(d, i) {  // Add interactivity

        console.log('mouseover');

        // Use D3 to select element, change size

        select(this).transition().duration(1000).attr('r', 150).on('end', function(d){
          select(this).moveToFront();
          select('#html_' + d.id).style('opacity', 1);
          select('#title_' + d.id).moveToFront();
        });
        select('#html_' + d.id).html(function(d) {
          return d.Species + ' ' + d.Study;
        });
      }

      function handleMouseOut(d, i) {
        // bad hardcoding :(
        const backgroundCircles = [13, 16, 17, 19, 20, 7, 26, 28, 29, 30];
        // Use D3 to select element, change size
        select(this).transition().duration(1000).attr('r', function(j) { return radiusScale(+d.Population); })
        select(this).moveToBack();

        select('#html_' + d.id).html(function(d){
          return d.Species;
        });

        if ( backgroundCircles.indexOf(+d.id) > -1) {
          select('#html_' + d.id).style('opacity', 0);
        }
      }
  }

  // Defines a sort order so that the smallest dots are drawn on top.
  order(a, b) {
    return +b.Population - +a.Population;
  }

}
