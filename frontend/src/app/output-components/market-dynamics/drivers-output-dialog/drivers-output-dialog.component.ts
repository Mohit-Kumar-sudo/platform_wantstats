import { Component, OnInit, Inject, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as d3 from 'd3';
import * as html2canvas from 'html2canvas';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { ConstantKeys } from 'src/app/constants/mfr.constants';
import * as _ from 'lodash'
import { ExcelDownloadService } from 'src/app/services/excel-download.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedAnalyticsService } from 'src/app/services/shared-analytics.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-drivers-output-dialog',
  templateUrl: './drivers-output-dialog.component.html',
  styleUrls: ['./drivers-output-dialog.component.scss']
})
export class DriversOutputDialogComponent implements OnInit {

  cnt: number;
  showYear: any;
  reportName: any;
  endYear: any;
  startYear: any;
  types: any;
  typeParam:any;
  analyzeData:any;
  reportId:any;
  permissions: any;

  constructor(
    public dialogRef: MatDialogRef<DriversOutputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private localStorageService: LocalStorageService,
    private excelDownloadService: ExcelDownloadService,
    public activateRoutes: ActivatedRoute,
    private sharedAnalyticsService: SharedAnalyticsService,
    public routes: Router,
    private authService: AuthService
  ) {
    activateRoutes.queryParams.subscribe(
      params => this.typeParam = params['type']);
  }

  finalObject: any = [];
  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  i = 0;

  ngOnInit() {
    this.i = 0;
    const currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    this.reportName = currentReport.title;
    this.startYear = currentReport.me.start_year;
    this.endYear = currentReport.me.end_year;
    this.types = this.data.types;
    this.finalObject = this.data;
    this.reportId = currentReport._id;
    this.generateTrees();
    document.getElementById('scrollToTop').scrollTo(0, -100);
    this.permissions= this.authService.getUserPermissions();
  }

  analyze() {

    this.analyzeData = {
      reportId: this.reportId,
      tabSelected: this.typeParam,
      subSegmentSelected: ""
    }
    this.sharedAnalyticsService.data = this.analyzeData;
    this.routes.navigateByUrl('/dashboard');
    this.doClose();
  }

  generateImage() {

    if (!this.permissions.imageExport) {
      return this.authService.showNotSubscribedMsg();
    }
    // @ts-ignore
    html2canvas(this.screen.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'Chart.png';
      this.downloadLink.nativeElement.click();
    });
  }

  generateTrees() {
    this.cnt = 0;
    if (this.cnt == 0) {
      let length = this.finalObject.length;
      this.cnt = (this.cnt + 1 + length) % length;
      this.renderTree(this.finalObject[this.cnt]);
      this.showYear = this.finalObject[this.cnt].year;
      this.cnt++;
      if (this.cnt > 0) {
        d3.interval(() => {
          if (this.finalObject.length > 0) {
            this.cnt = (this.cnt + 1 + length) % length;
            d3.select('#driver-container1 svg').remove();
            this.renderTree(this.finalObject[this.cnt]);
            this.showYear = this.finalObject[this.cnt].year;
          }
        }, 1000);
      }
    }
  }

  renderTree(treeData) {
    var margin = { top: 5, right: 500, bottom: 10, left: 100 },
      width = 1000 - margin.right - margin.left,
      height = 260 - margin.top - margin.bottom;


    var svg = d3.select('#driver-container1')
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
          if(d.data.rating == 5){
            return d.data.name
          }else{
           return d.data.rating > 5 && d.data.rating <= 10 ? (d.data.rating > 5 && d.data.rating <= 7) ? d.data.name + ' (medium impact)' : d.data.name + ' (high impact )' : d.depth > 0 ? d.data.name + ' (low impact)' : d.data.name;
          }
        })
        .style('fill-opacity', 1e-6)
        .style('font', '12px sans-serif')
        .style('font-weight', function (d) {
          return d.data.percent >= 70 ? 'bold' : 'normal';
        })
        .call(wrap, 480);

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

  doClose() {
    this.finalObject = [];
    d3.select('#driver-container1').selectAll('svg').remove();
    this.dialogRef.close();
  }

  @HostListener('document:click')
  clickout() {
    this.i++;
    if (this.i > 1) {
      this.finalObject = [];
    }
  }
}




