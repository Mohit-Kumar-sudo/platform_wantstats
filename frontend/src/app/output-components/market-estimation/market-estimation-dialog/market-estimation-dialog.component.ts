import { Component, OnInit, Inject, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as d3 from 'd3';
import * as html2canvas from 'html2canvas';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { ConstantKeys } from 'src/app/constants/mfr.constants';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-market-estimation-dialog',
  templateUrl: './market-estimation-dialog.component.html',
  styleUrls: ['./market-estimation-dialog.component.scss']
})
export class MarketEstimationDialogComponent implements OnInit {

  cnt: number;
  showYear: any;
  reportName: any;
  endYear: any;
  startYear: any;
  treeData:any;
  baseYear:any;
  metric:any;
  permissions:any;

  constructor(
    public dialogRef: MatDialogRef<MarketEstimationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private localStorageService: LocalStorageService,
    private routes: Router,
    private authService: AuthService
  ) { }

  finalObject: any = [];
  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;

  ngOnInit() {
    const currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    // const currentReport = JSON.parse('{"_id":"5d95c79343759d0004219d04","status":"NOT STARTED","title":"1111 report demo","category":"tech","vertical":"SEMI","me":{"start_year":2016,"end_year":2019,"base_year":2018},"tocList":[{"section_id":"1","section_name":"MARKET ESTIMATION","section_key":"MARKET_ESTIMATION","urlpattern":"market-estimation","is_main_section_only":false},{"section_id":"2","section_name":"EXECUTIVE SUMMARY","section_key":"EXECUTIVE_SUMMARY","urlpattern":"executive-summary","is_main_section_only":true},{"section_id":"3","section_name":"MARKET INTRODUCTION","section_key":"MARKET_INTRODUCTION","urlpattern":"market-introduction","is_main_section_only":false},{"section_id":"4","section_name":"RESEARCH METHODOLOGY","section_key":"RESEARCH_METHODOLOGY","urlpattern":"research-methodology","is_main_section_only":true},{"section_id":"5","section_name":"MARKET DYNAMICS","section_key":"MARKET_DYNAMICS","urlpattern":"market-introduction","is_main_section_only":false},{"section_id":"6","section_name":"MARKET FACTOR ANALYSIS","section_key":"MARKET_FACTOR_ANALYSIS","urlpattern":"market-factor-analysis","is_main_section_only":false},{"section_id":"7","section_name":"MARKET OVERVIEW","section_key":"MARKET_OVERVIEW","urlpattern":"market-overview","is_main_section_only":false},{"section_id":"8","section_name":"COMPETITIVE LANDSCAPE","section_key":"COMPETITIVE_LANDSCAPE","urlpattern":"competitive-landscape","is_main_section_only":false},{"section_id":"9","section_name":"COMPANY PROFILES","section_key":"COMPANY_PROFILES","urlpattern":"company-profile","is_main_section_only":false},{"section_id":0,"section_name":"ABC","is_main_section_only":true,"urlpattern":"other-module"},{"section_id":0,"section_name":"XYZ","is_main_section_only":true,"urlpattern":"other-module"},{"section_id":0,"section_name":"D1","is_main_section_only":true,"urlpattern":"other-module"},{"section_id":0,"section_name":"D2","is_main_section_only":true,"urlpattern":"other-module"},{"section_id":0,"section_name":"D3","is_main_section_only":true,"urlpattern":"other-module"},{"section_id":0,"section_name":"D4","is_main_section_only":true,"urlpattern":"other-module"},{"section_id":0,"section_name":"AS","is_main_section_only":true,"urlpattern":"other-module"}],"owner":"5cd66952c2ee07f440988b60"}');
    this.reportName = currentReport.title;
    this.startYear = currentReport.me.start_year;
    this.endYear = currentReport.me.end_year;
    if(this.data && this.data.data){
      this.treeData = this.data.data;
      this.baseYear = this.data.baseYear;
      this.metric = this.data.metric
    }
    this.generateTrees();
    window.scroll(0,0)
    this.permissions= this.authService.getUserPermissions();
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
    this.renderTree(this.treeData);
  }

  renderTree(treeData) {
    var margin = { top: 5, right: 230, bottom: 10, left: 230 },
      width = 850 - margin.right - margin.left,
      height = 380 - margin.top - margin.bottom;

    var svg = d3.select('#dendo-container1')
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
    root.children.forEach(collapse);



    update(root);

    // Collapse the node and all it's children
    function collapse(d) {
      if (d.children) {
        if (parseInt(d.depth) > 1) {
          d._children = d.children;
          d.children = null;
          d.data.open = false;
        } else {
          d.children.forEach(collapse);
        }
      }
    }
    function update(source) {
      // Assigns the x and y position for the nodes
      var treeData = treemap(root);

      // Compute the new tree layout.
      var nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);



      // Normalize for fixed-depth.
      // nodes.forEach(function(d){ d.y = d.depth * 180});


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
        })
        .on('click', click);

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
        .attr('fill', 'white')
        .attr('text', '+')
        .attr('cursor', 'pointer')
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
          return d.children || d._children ? 'end' : 'start';
        })
        .text(function (d) {
          let percent = ''
          if (d && d.data && d.data.percent) {
            percent = d.data.percent;
            percent = percent.replace('%', '')
          }
          let name = "";
          if (d.data.name) {
            name = d.data.name.substring(d.data.name.indexOf("_") + 1);
          }
          if (d.depth == 0) {
            return d.data.name;
          } else if (d.depth == 3) {
            if (typeof d.data.amount === 'undefined') {
              return name
            } else {
              return name + ', ' + d.data.amount + ', ' + percent + '%';
            }
          } else {
            return name + ', ' + d.data.amount + ', ' + percent + '%';
          }
        })
        .style('fill-opacity', 1e-6)
        .style('font', '10px sans-serif')
        .style('font-weight', function (d) {
          return d.data.percent >= 70 ? 'bold' : 'normal';
        });

      // UPDATE
      var nodeUpdate = nodeEnter.merge(node);

      // Transition to the proper position for the node
      nodeUpdate.transition()
        .duration(duration)
        .attr('transform', function (d) {
          return 'translate(' + d.y + ',' + d.x + ')';
        });

      // Update the node attributes and style
      nodeUpdate.select('image')
        // .attr("r", 4.5)
        // .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
        .attr('href', function (d) {
          return !(d.children || d._children) ? '' : d.data.open == true ? '../../assets/images/remove.png' : '../../assets/images/add.png';
        });

      nodeUpdate.select('text')
        .style('fill-opacity', 1);


      // Remove any exiting nodes
      var nodeExit = node.exit().transition()
        .duration(duration)
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
        .attr('stroke-width', function (d){
          if(d.data.color == 'green'){
            return '2px'
          }else{
            return '1px'
          }
        })
        .attr('stroke', function (d) {

          return d.data.color;
        })
        .attr('d', function (d) {
          var o = { x: source.x0, y: source.y0 };
          return diagonal(o, o);
        });

      // UPDATE
      var linkUpdate = linkEnter.merge(link);

      // Transition back to the parent element position
      linkUpdate.transition()
        .duration(duration)
        .attr('d', function (d) {
          return diagonal(d, d.parent);
        });

      // Remove any exiting links
      var linkExit = link.exit().transition()
        .duration(duration)
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

    }
  }
  analyze() {
    this.routes.navigateByUrl('/dashboard');
    this.doClose();
  }
  doClose() {
    this.data = [];
    d3.select('#dendo-container1').selectAll('svg').remove();
    this.dialogRef.close();
  }
  @HostListener('document:click')
  clickout() {
    this.data = [];
  }
}
