import { Component, ElementRef, OnInit, TemplateRef, ViewChild, Input } from '@angular/core';
import * as d3 from 'd3';
import { MatDialog } from '@angular/material/dialog';
import * as html2canvas from 'html2canvas';
import { ReportService } from 'src/app/services/report.service';
import {LocalStorageService} from '../../../services/localstorage.service';
import { ConstantKeys } from 'src/app/constants/mfr.constants';

@Component({
  selector: 'app-porters-dropdown',
  templateUrl: './porters-dropdown.component.html',
  styleUrls: ['./porters-dropdown.component.scss']
})
export class PortersDropdownComponent implements OnInit {

  @Input('dataType') dataType;
  @Input('chartId') chartId;
  @Input('index') index;
  @Input('reportId') reportId;

  treeArray = [
    {
      name: "",
      children: [],
      id: ""
    }
  ]
  showYear;
  treeData;
  cnt;
  currentReport: any;


  getReportDetails() {
    this.currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    this.reportService.getSectionKeyDetials(this.reportId._id, 'MARKET_FACTOR_ANALYSIS').subscribe(d => {
      this.getReportDetailsSuccess(d);
      window.scroll(0,0)
    }, error => {

    });
  }

  getReportDetailsSuccess(data: any) {
    data.forEach(d => {
      if (d.meta_info.section_key === "porter") {
        this.getPortersDataSuccess(d.meta.data);
      }
    })
    // this.spinner.hide();
  }

  getPortersDataSuccess(data) {
    data.filter(item => {
      if (item.type == this.dataType) {
        if (this.treeArray) {
          this.treeArray[0].name = this.dataType;
          this.treeArray[0].children.push(item);
        }
      }
    })
    this.renderChart();
  }

  constructor(public dialog: MatDialog,
    private reportService: ReportService,
    private localStorageService: LocalStorageService) {
  }

  ngOnInit() {
    this.cnt = 0;
    this.getReportDetails();
  }

  renderChart() {
    if (this.cnt == 0) {
      this.cnt = (this.cnt + 1 + this.treeArray.length) % this.treeArray.length;

      this.renderTree(this.treeArray[this.cnt]);
      this.showYear = this.treeArray[this.cnt];
      this.cnt++;
      if (this.cnt > 0) {
        this.cnt = (this.cnt + 1 + this.treeArray.length) % this.treeArray.length;
        let id = '#driver-container-' + this.chartId + this.index + ' svg';
        this.treeArray[0].id = id;
        d3.select(id).remove();
        this.renderTree(this.treeArray[this.cnt]);
        this.showYear = this.treeArray[this.cnt];
      }
    }
  }

  renderTree(treeData) {
    var margin = { top: 5, right: 350, bottom: 10, left: 100 },
      width = 700 - margin.right - margin.left,
      height = 260 - margin.top - margin.bottom;

    let id = '#driver-container-' + this.chartId + this.index;
    var svg = d3.select(id)
      .append('svg')
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var i = 0,
      duration = 750,
      root;


    // declares a tree layout and assigns the size
    var treemap = d3.tree().size([height, width]);

    // Assigns parent, children, height, depth
    root = d3.hierarchy(treeData, function (d) {
      return d.children;
    });
    root.x0 = height / 2;
    root.y0 = 0;

    update(root);

    // Collapse the node and all it's children
    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    function update(source) {

      // Assigns the x and y position for the nodes
      var treeData = treemap(root);

      // Compute the new tree layout.
      var nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);

      // Update the nodes...
      var node = svg.selectAll('g.node')
        .data(nodes, function (d) {
          return d.id || (d.id = ++i);
        });

      // Enter any new modes at the parent's previous position.
      var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', function (d) {
          return 'translate(' + source.y0 + ',' + source.x0 + ')';
        });

      // Add Circle for the nodes
      nodeEnter.append('image')
        .attr('href', function (d) {
          return !(d.children || d._children) ? '' : d.data.open == true ? '../../assets/images/remove.png' : '../../assets/images/add.png';
        })
        .attr('x', -5)
        .attr('x', -5)
        .attr('y', -10)
        .attr('width', 20)
        .attr('height', 20)
        .attr('stroke', 'black')
        .attr('fill', 'black')
        .attr('text', '+')
        .style('fill', function (d) {
          return d._children ? 'lightsteelblue' : '#fff';
        })
        .style('color', '#000');

      // Add labels for the nodes
      nodeEnter.append('text')
        .attr('x', function (d) {
          return d.children || d._children ? 10 : 10;
        })
        .attr('dy', function (d) {
          return d.children || d._children ? '-1em' : '0.5em';
        })
        .attr('text-anchor', function (d) {
          return d.children || d._children ? 'middle' : 'start';
        })
        .text(function (d) {

          return d.depth > 0 ? (d.data.rating >= 4 && d.data.rating <= 10 ?
            (d.data.rating >= 4 && d.data.rating <= 7) ? d.data.name + ' ( medium )'
              : d.data.name + ' ( high )' : d.depth > 0 ? d.data.name + ' ( low )'
              : d.data.name) : d.data.name;
        })
        .style('fill-opacity', 1e-6)
        .style('font', '12px sans-serif')
        .style('font-weight', function (d) {
          return d.data.percent >= 70 ? 'bold' : 'normal';
        })
        .call(wrap, 300);

      // UPDATE
      var nodeUpdate = nodeEnter.merge(node);

      // Transition to the proper position for the node
      nodeUpdate
        //   .duration(duration)
        .attr('transform', function (d) {
          return 'translate(' + d.y + ',' + d.x + ')';
        });

      // Update the node attributes and style
      nodeUpdate.select('image')
        .attr('href', function (d) {
          return !(d.children || d._children) ? '' : d.data.rating > 0 ? '../../assets/images/' + d.data.rating + '.png' : d.data.open == true ? '../../assets/images/remove.png' : '../../assets/images/add.png';
        });

      nodeUpdate.select('text')
        .style('fill-opacity', 1);


      // Remove any exiting nodes
      var nodeExit = node.exit()
        // .duration(duration)
        .attr('transform', function (d) {
          return 'translate(' + source.y + ',' + source.x + ')';
        })
        .remove();

      // On exit reduce the node circles size to 0
      nodeExit.select('circle')
        .attr('r', 1e-6);

      // On exit reduce the opacity of text labels
      nodeExit.select('text')
        .style('fill-opacity', 1e-6);

      // ****************** links section ***************************

      // Update the links...
      var link = svg.selectAll('path.link')
        .data(links, function (d) {
          return d.id;
        });

      // Enter any new links at the parent's previous position.
      var linkEnter = link.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr('fill', 'none')
        .attr('stroke-width', function (d) {
          return 0.5 * d.data.rating + 'px';
        })
        .attr('stroke', function (d) {
          return d.data.rating >= 4 && d.data.rating <= 10 ? (d.data.rating >= 4 && d.data.rating < 8) ? '#999' : 'red' : 'green';
        })
        .attr('d', function (d) {
          var o = { x: source.x0, y: source.y0 };
          return diagonal(o, o);
        });

      // UPDATE
      var linkUpdate = linkEnter.merge(link);

      // Transition back to the parent element position
      linkUpdate
        // .duration(duration)
        .attr('d', function (d) {
          return diagonal(d, d.parent);
        });

      // Remove any exiting links
      var linkExit = link.exit()
        //  .duration(duration)
        .attr('d', function (d) {
          var o = { x: source.x, y: source.y };
          return diagonal(o, o);
        })
        .remove();

      // Store the old positions for transition.
      nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      // Creates a curved (diagonal) path from parent to the child nodes
      function diagonal(s, d) {

        var path = `M ${s.y} ${s.x}
        C ${(s.y + d.y) / 2} ${s.x},
          ${(s.y + d.y) / 2} ${d.x},
          ${d.y} ${d.x}`;

        return path;
      }

      // Toggle children on click.
      function click(d) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
          d.data.open = false;
        } else {
          d.children = d._children;
          d._children = null;
          d.data.open = true;
        }

        update(d);
      }

      function wrap(text, width) {
        text.each(function () {

          var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy"));

          var tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
          while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
          }

        });
      }

    }
  }

}
