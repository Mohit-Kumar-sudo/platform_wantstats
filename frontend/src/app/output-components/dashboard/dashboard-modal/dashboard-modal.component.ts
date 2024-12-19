import { Component, Inject, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import * as chartConfig from './../../../sharedCharts/sharedColumnBarChart/column-bar-chart-configs';
import * as chartConfig from '../../../components/core/bar-chart-input/bar-chart-configs';
import * as d3 from 'd3';
import { RadarChartService } from 'src/app/services/radar-chart.service';
import mermaid from 'mermaid';
declare var JSONLoop: any;
declare var $: any;

@Component({
  selector: 'app-dashboard-modal',
  templateUrl: './dashboard-modal.component.html',
  styleUrls: ['./dashboard-modal.component.scss']
})

export class DashboardModalComponent implements OnInit, AfterViewInit, OnDestroy {
  chartConfigs: any;
  cnt = [];
  showYear: any = [];
  htmlElement: HTMLElement;
  @ViewChild('porter01') porter01: ElementRef;
  @ViewChild('porter02') porter02: ElementRef;
  @ViewChild('porter03') porter03: ElementRef;
  @ViewChild('porter04') porter04: ElementRef;
  @ViewChild('chain01') chain01: ElementRef;
  @ViewChild('chain02') chain02: ElementRef;
  @ViewChild('chain03') chain03: ElementRef;
  @ViewChild('chain04') chain04: ElementRef;
  chartText: any = [];
  svgCode: any = [];
  element: HTMLElement;
  interval: any = [];
  0
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DashboardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public inputData: any,
    private chartService: RadarChartService
  ) {
    console.log(this.inputData);
  }

  ngOnInit() {
    this.chartConfigs = chartConfig;
    window.scroll(0,0)
  }

  ngAfterViewInit() {
    mermaid.initialize(
      {
        theme: 'forest',
        startOnLoad: false,
        securityLevel: 'loose',
        cloneCssStyles: true,
        flowchart: {
          htmlLabels: false,
          useMaxWidth: false
        },
      });
    this.inputData.forEach((d, i) => {
      if (d.marketDynamics && d.marketDynamics.type === 'dendrogram') {
        this.generateTrees(i)
      } else if (d.portersDiagram && d.portersDiagram.type === 'porter-graph') {
        this.renderPorter(i, d.portersDiagram.data);
      } else if (d.supplyChain && d.supplyChain.type === 'supply-chain') {
        this.generateSupplyChain(i);
      } else if (d.productOffering && d.productOffering.type === 'productOffering') {
        this.orgCharts(i)
      }
    })
  }

  doClose() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.interval.length) {
      this.interval.forEach(d => {
        d.stop()
      })
    }
  }

  generateTrees(index) {
    if (this.interval[index]) {
      this.interval[index].stop()
    }
    this.cnt[index] = 0;
    if (this.cnt[index] == 0) {
      let length = this.inputData[index].marketDynamics.data.length;
      this.cnt[index] = (this.cnt[index] + 1 + length) % length;
      this.renderTree(this.inputData[index].marketDynamics.data[this.cnt[index]], index);
      this.showYear[index] = this.inputData[index].marketDynamics.data[this.cnt[index]].year;
      this.cnt[index]++;
      if (this.cnt[index] > 0) {
        this.interval[index] = d3.interval(() => {
          this.cnt[index] = (this.cnt[index] + 1 + length) % length;
          if (this.inputData[index].marketDynamics.data.length > 1) {
            d3.select('#dia-driver-container' + index + ' svg').remove();
            this.renderTree(this.inputData[index].marketDynamics.data[this.cnt[index]], index);
            this.showYear[index] = this.inputData[index].marketDynamics.data[this.cnt[index]].year;
          }
        }, 1000);
      }
    }
  }

  renderTree(treeData, index) {
    var margin = { top: 5, right: 300, bottom: 10, left: 100 },
      width = 600 - margin.right - margin.left,
      height = 260 - margin.top - margin.bottom;

    var svg = d3.select('#dia-driver-container' + index)
      .append('svg')
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var i = 0,
      duration = 750,
      root;


    svg.exit().remove()

    // declares a tree layout and assigns the size
    var treemap = d3.tree().size([height, width]);

    // Assigns parent, children, height, depth
    root = d3.hierarchy(treeData, function (d) {
      return d.children;
    });
    root.x0 = height / 2;
    root.y0 = 0;

    // Collapse after the second level
    //root.children.forEach(collapse);

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

      // Normalize for fixed-depth.
      //nodes.forEach(function(d){ d.y = d.depth * 180});

      // ****************** Nodes section ***************************

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
          return d.data.rating >= 5 && d.data.rating <= 10 ? (d.data.rating >= 5 && d.data.rating <= 7) ? d.data.name + ' (medium impact)' : d.data.name + ' (high impact )' : d.depth > 0 ? d.data.name + ' (low impact)' : d.data.name;
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
        // .attr("r", 4.5)
        // .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
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
            y = text.attr('y'),
            dy = parseFloat(text.attr('dy'));

          var tspan = text.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'em');
          while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(' '));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(' '));
              line = [word];
              tspan = text.append('tspan').attr('x', 0).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
            }
          }

        });
      }

    }
  }

  renderPorter(i, data) {
    if (i === 0) {
      this.htmlElement = this.porter01.nativeElement
      this.chartService.setup(this.htmlElement);
      this.chartService.populate(data);
    } else if (i === 1) {
      this.htmlElement = this.porter02.nativeElement
      this.chartService.setup(this.htmlElement);
      this.chartService.populate(data);
    } else if (i === 2) {
      this.htmlElement = this.porter03.nativeElement
      this.chartService.setup(this.htmlElement);
      this.chartService.populate(data);
    } else if (i === 3) {
      this.htmlElement = this.porter04.nativeElement
      this.chartService.setup(this.htmlElement);
      this.chartService.populate(data);
    }
  }

  generateSupplyChain(index) {
    let text = 'graph LR;';
    for (let i = 0; i < this.inputData[index].supplyChain.paths.length; i++) {
      text += this.inputData[index].supplyChain.paths[i].from.order_id + '[' + this.inputData[index].supplyChain.paths[i].from.title + '] -->'
        + this.inputData[index].supplyChain.paths[i].to.order_id + '[' + this.inputData[index].supplyChain.paths[i].to.title + '];';
    }
    this.chartText[index] = text;
    this.svgCode[index] = '';
    if (!this.chartText[index]) {
      this.chartText[index] = 'graph TD;';
    }
    if (index === 0) {
      this.element = this.chain01.nativeElement;
    } else if (index === 1) {
      this.element = this.chain02.nativeElement;
    } else if (index === 2) {
      this.element = this.chain03.nativeElement;
    } else if (index === 3) {
      this.element = this.chain04.nativeElement;
    }
    const graphDefinition = this.chartText[index];
    mermaid.render('dia-graphDiv' + index, graphDefinition, (svgCode, bindFunctions) => {
      this.element.innerHTML = svgCode;
      this.svgCode[index] = svgCode;
    });
  }

  // product offering
  orgCharts(i) {
    let temporaryThis = this;
    (function ($, JSONLoop) {
      $(function () {
        var datasource = {};
        temporaryThis.inputData[i].productOffering.data.forEach(item => {
          if (item.children) {
            delete item.children
          }
        })
        temporaryThis.inputData[i].productOffering.data.forEach(function (item) {
          if (!item.parentId) {
            delete item.parentId;
            Object.assign(datasource, item);
          } else {
            var jsonloop = new JSONLoop(datasource, 'id', 'children');
            jsonloop.findNodeById(datasource, item.parentId, function (err, node) {
              if (err) {
                console.error(err);
              } else {
                delete item.parentId;
                if (node.children) {
                  node.children.push(item);
                  var b = 2;
                } else {
                  node.children = [item];
                  var a = 1;
                }
              }
            });
          }
        });
        var oc = $('#chart-container-org' + i).orgchart({
          'data': datasource,
          'chartClass': 'edit-state',
          'zoom': true,
          'pan': true,
          'parentNodeSymbol': 'fa-th-large',
        });
      });

    })($, JSONLoop);
  }
}
