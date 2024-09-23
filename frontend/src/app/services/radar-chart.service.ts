import { Injectable } from '@angular/core';
import * as D3 from 'd3';
import { RadarModules } from '../models/radar/radar.model';

@Injectable()
export class RadarChartService {
  private host;
  private svg;
  private config;
  private axisProperties;
  private axisLabels;
  private totalAxes;
  private radius;
  private axes;
  private levels;
  private companies;
  private tooltip;

  constructor() {
    this.config = {
      margin: {
        top: 40,
        right: 150,
        bottom: 40,
        left: 150,
      },
      width: 200,
      height: 200,
      radians: 2 * Math.PI,
      levels: 5,
    };
    this.axisProperties = [
      'threatOfNewEntrantsRating',
      'bargainingPowerOfSuppliersRating',
      'threatOfSubstitutesRating',
      'segmentRivalryRating',
      'bargainingPowerOfBuyersRating',
    ];
    this.axisLabels = [
      'Threat of New Entrants',
      'Bargaining Power of Suppliers',
      'Threat of Substitutes',
      'Segment Rivalry',
      'Bargaining Power of Buyers',
    ];
    this.totalAxes = this.axisProperties.length;
    this.radius = Math.min(this.config.width / 2, this.config.height / 2);
  }

  public setup(htmlElement: HTMLElement): void {
    this.host = D3.select(htmlElement);
    this.buildSVG();
    this.drawAxes();
    this.drawLevels();
  }

  /**
   * Build the SVG element.
   **/
  private buildSVG(): void {
    this.svg = this.host
      .append('svg')
      .attr(
        'width',
        this.config.width + this.config.margin.left + this.config.margin.right
      )
      .attr(
        'height',
        this.config.height + this.config.margin.top + this.config.margin.bottom
      )
      .append('g')
      .attr(
        'transform',
        'translate(' +
          this.config.margin.left +
          ',' +
          this.config.margin.top +
          ')'
      )
      .append('g');

    this.tooltip = this.host
      .append('div')
      .attr('class', 'company-tooltip')
      .style('opacity', 0);
  }

  /**
   * Draw the axes.
   **/
  private drawAxes(): void {
    this.axes = this.svg
      .selectAll('.axis')
      .data(this.axisLabels)
      .enter()
      .append('g')
      .attr('class', 'axis');

    this.axes
      .append('line')
      .attr('class', 'axis-line')
      .attr('x1', this.config.width / 2)
      .attr('y1', this.config.width / 2)
      .attr('x2', (d, i) => {
        return (
          (this.config.width / 2) *
          (1 - Math.sin((i * this.config.radians) / this.totalAxes))
        );
      })
      .attr('y2', (d, i) => {
        return (
          (this.config.height / 2) *
          (1 - Math.cos((i * this.config.radians) / this.totalAxes))
        );
      });

    this.axes
      .append('text')
      .attr('class', 'label')
      .text((d: string) => d)
      .attr('text-anchor', 'middle')
      .attr('x', (d, i) => {
        return (
          (this.config.width / 2) *
          (1 - 1.3 * Math.sin((i * this.config.radians) / this.totalAxes))
        );
      })
      .attr('y', (d, i) => {
        return (
          (this.config.height / 2) *
          (1 - 1.1 * Math.cos((i * this.config.radians) / this.totalAxes))
        );
      });
  }

  private drawLevels(): void {
    this.levels = this.svg
      .selectAll('.levels')
      .append('g')
      .attr('class', 'levels');

    for (let level = 0; level < this.config.levels; level++) {
      let levelFactor = this.radius * ((level + 1) / this.config.levels);

      // build level-lines
      this.levels
        .data(this.axisLabels)
        .enter()
        .append('line')
        .attr('class', 'level')
        .attr('x1', (d, i) => {
          return (
            levelFactor *
            (1 - Math.sin((i * this.config.radians) / this.totalAxes))
          );
        })
        .attr('y1', (d, i) => {
          return (
            levelFactor *
            (1 - Math.cos((i * this.config.radians) / this.totalAxes))
          );
        })
        .attr('x2', (d, i) => {
          return (
            levelFactor *
            (1 - Math.sin(((i + 1) * this.config.radians) / this.totalAxes))
          );
        })
        .attr('y2', (d, i) => {
          return (
            levelFactor *
            (1 - Math.cos(((i + 1) * this.config.radians) / this.totalAxes))
          );
        })
        .attr(
          'transform',
          'translate(' +
            (this.config.width / 2 - levelFactor) +
            ', ' +
            (this.config.height / 2 - levelFactor) +
            ')'
        );
    }
  }

  public populate(companies: Array<RadarModules>): void {
    if (!this.svg) {
      return;
    }
    const over = 'ontouchstart' in window ? 'touchstart' : 'mouseover';
    const out = 'ontouchstart' in window ? 'touchend' : 'mouseout';
    this.companies = this.svg
      .selectAll('.company')
      .data(companies, (company) => company.name);

    this.companies.exit().remove();
    let enterSelection = this.companies
      .enter()
      .append('g')
      .attr('class', (company: RadarModules) => 'company ' + company.name);

    enterSelection
      .append('polygon')
      .attr('class', 'area')
      .attr('points', (company: RadarModules) =>
        this.getCompanyCoordinatesString(company)
      )
      .attr('stroke-width', '1.5px')
      .attr('stroke', 'red')
      .attr('fill', 'red')
      .attr('fill-opacity', 0.3)
      .attr('stroke-opacity', 1)
      .on(over, (company: RadarModules) => {
        this.svg.selectAll('polygon').transition(200).attr('fill-opacity', 0.1);
        this.svg
          .selectAll('g.company.' + company.name + ' polygon')
          .transition(200)
          .attr('fill-opacity', 0.7);
        this.tooltipShow(company);
      })
      .on(out, (_) => {
        this.svg.selectAll('polygon').transition(200).attr('fill-opacity', 0.3);
        this.tooltipHide();
      });

    this.svg.selectAll('.axis').attr('fill', (d, i) => {
      let val1 = parseInt(companies[0][this.axisProperties[i]]);

      if (val1 <= 3) {
        return 'green';
      } else if (val1 >= 4 && val1 <= 7) {
        return 'grey';
      } else {
        return 'red';
      }
      // return parseInt(companies[0][this.axisProperties[i]]) <= 3 ? 'green' : parseInt(companies[0][this.axisProperties[i]]) <= 7 ? 'grey' : 'red';
    });

    this.svg
      .selectAll('.level')
      .attr('stroke', '#999')
      .attr('stroke-width', '.5px');
    this.svg
      .selectAll('.axis line')
      .attr('stroke', '#999')
      .attr('stroke-width', '1px');
  }

  private getCompanyCoordinates(company: RadarModules): Array<any> {
    const maxValue = 10;
    const coords = [];

    this.axisProperties.forEach((prop, index) => {
      const val = company[prop];
      coords.push({
        x:
          (this.config.width / 2) *
          (1 -
            (val / maxValue) *
              Math.sin((index * this.config.radians) / this.totalAxes)),
        y:
          (this.config.height / 2) *
          (1 -
            (val / maxValue) *
              Math.cos((index * this.config.radians) / this.totalAxes)),
      });
    });
    return coords;
  }

  private getColorCode(company: RadarModules, i: any): String {
    const val = company[this.axisProperties[i]];

    return '0';
  }

  private getCompanyCoordinatesString(company: RadarModules): string {
    const coords = this.getCompanyCoordinates(company);

    let pointsString = '';
    coords.forEach((point) => {
      pointsString += point.x + ',' + point.y + ' ';
    });
    return pointsString;
  }

  //show tooltip of vertices
  private tooltipShow(company: RadarModules): void {
    this.tooltip.transition().duration(200).style('opacity', 1);
    let html = '<h3 class="header">' + company.name + '</h3>';
    this.axisProperties.forEach((prop, index) => {
      let val = parseInt(company[prop]);
      let val1 = '';
      if (val <= 3) {
        val1 = 'Low';
      } else if (val >= 4 && val <= 7) {
        val1 = 'Medium';
      } else {
        val1 = 'High';
      }

      html +=
        '<div class="rating">' +
        this.axisLabels[index] +
        ': ' +
        val1 +
        '</div>';
    });
    this.tooltip.html(html);
    this.tooltip
      .style('left', D3.event.pageX - 150 + 'px')
      .style('top', D3.event.pageY - 150 + 'px')
      .style('border-color', 'black');
  }

  private tooltipHide(): void {
    this.tooltip.transition().duration(500).style('opacity', 0);
  }
}
