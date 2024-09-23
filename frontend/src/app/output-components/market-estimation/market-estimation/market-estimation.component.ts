import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MarketEstimationDialogComponent } from '../market-estimation-dialog/market-estimation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConstantKeys } from 'src/app/constants/mfr.constants';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { ReportService } from 'src/app/services/report.service';
import { SharedAnalyticsService } from 'src/app/services/shared-analytics.service';
import { MarketEstimationService } from 'src/app/services/market-estimation.service';
import * as d3 from 'd3';
import * as html2canvas from 'html2canvas';
import * as _ from 'lodash';
import { MarketBreakupService } from 'src/app/services/market-breakup.service';


declare var $: any;
declare var JSONLoop: any;

@Component({
  selector: 'app-market-estimation',
  templateUrl: './market-estimation.component.html',
  styleUrls: ['./market-estimation.component.scss']
})
export class MarketEstimationComponent implements OnInit {

  reportName = '';
  startYear = '';
  endYear = '';
  treeData;
  reportId = '';
  data: any;
  baseYear = '';
  cnt = 0;
  allRegions: any;
  regionData: any;
  regions: any;
  analyzeData: any;
  metric = '';
  bifurcationLevel = 1;
  meData: any;
  keyword: any;
  permissions: any;

  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;

  constructor(public dialog: MatDialog, private routes: Router,
              private localStorageService: LocalStorageService,
              private marketEstimationService: MarketEstimationService,
              private spinner: NgxSpinnerService,
              private authService: AuthService,
              private reportService: ReportService,
              public activatedRoute: ActivatedRoute,
              private sharedAnalyticsService: SharedAnalyticsService,
              private requestMarketBreakupDataService: MarketBreakupService ) {
              this.sharedAnalyticsService.setReload(true)
  }

  generateImage() {
    if (!this.permissions.imageExport) {
      return this.authService.showNotSubscribedMsg();
    }
    // @ts-ignore
    html2canvas(this.screen.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'Market Estimation, ' + this.reportName +
        ' Market [' + this.startYear + ' - ' + this.endYear + '], Base Year: ' + this.baseYear;
      this.downloadLink.nativeElement.click();
    });
  }

  ngOnInit() {
    this.sharedAnalyticsService.setReload(true)
    this.spinner.show();
    this.permissions = this.authService.getUserPermissions();
    if (this.activatedRoute.snapshot.queryParams['reportId']) {
      this.reportService.getById(this.activatedRoute.snapshot.queryParams['reportId']).subscribe(data => {
        if (data) {
          const localData = {
            _id:data._id,
            title:data.title,
            category: data.category,
            vertical:data.vertical,
            me:{
              start_year:data.me.start_year,
              end_year:data.me.end_year,
              base_year:data.me.base_year
            },
            overlaps:data.overlaps,
            owner:data.owner,
            tocList:data.tocList,
            status:data.status,
            title_prefix:data.title_prefix,
            youtubeContents:data.youtubeContents
          }
          this.localStorageService.set(ConstantKeys.CURRENT_REPORT, localData);
          this.getAPIData();
        }
      });
    } else {
      this.getAPIData();
    }
  }

  getAPIData() {
    this.sharedAnalyticsService.setReload(true)
    const currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    this.reportName = currentReport.title;
    this.startYear = currentReport.me.start_year;
    this.endYear = currentReport.me.end_year;
    this.reportId = currentReport._id;

    if (this.activatedRoute.snapshot.queryParams) {
      if (this.activatedRoute.snapshot.queryParams['reportId']) {
        this.reportId = this.activatedRoute.snapshot.queryParams['reportId'];
        this.reportService.setReportData(this.reportId);
      }
      if (this.activatedRoute.snapshot.queryParams['reportName']) {
        this.reportName = this.activatedRoute.snapshot.queryParams['reportName'];
      }
    }
    this.marketEstimationService.getMeData(this.reportId).subscribe(d => {
      if (this.activatedRoute.snapshot.queryParams) {
        if (d.data && d.data[0] && d.data[0].me) {
          this.startYear = d.data[0].me.start_year;
          this.endYear = d.data[0].me.end_year;
          if (d.data[0].me.data) {
            this.meData = d.data[0].me.data;
          }
          if (d.data[0].me.bifurcationLevel) {
            this.bifurcationLevel = d.data[0].me.bifurcationLevel;
          }
        }
      }
      this.getReportDetailsSuccess(d);
      window.scroll(0,0)
    }, error => {
    });
  }

  getReportDetailsSuccess(data: any) {
    if (data && data.data && data.data[0] && data.data[0].me) {
      this.data = data.data[0].me.segment;
      this.allRegions = data.data[0].me.geo_segment;
      this.baseYear = data.data[0].me.base_year;

      this.regionData = [];
      if (this.allRegions.length) {
        this.allRegions.forEach(element => {
          let temp = {
            id: element.id,
            name: element.region,
            children: element.countries
          };
          this.regionData.push(temp);
        });
        this.regions = {
          id: '1',
          name: 'Region',
          children: this.regionData

        };
        this.orgCharts(this.regions);
      } else {
        this.spinner.hide();
      }

    }
  }

  getRegionDataSuccess(data, regionId) {
    if (data && data.data && data.data[0]) {
      if (!this.metric && data.data[0].metric) {
        this.metric = data.data[0].metric;
        if (this.metric == 'Kilo Tons') {
          this.metric = data.data[0].metric;
        } else {
          this.metric = 'USD ' + this.metric;
        }
      }
      let value = data.data[0].value;
      this.regions.children.forEach(element => {
        if (element.id == regionId) {
          let allKeys = Object.keys(value[value.length - 1]);
          let cagrKey = '';
          let parent_key = '';

          allKeys.forEach(ele => {
            if (ele.includes('CAGR (%) ')) {
              cagrKey = ele;
            }
          });
          parent_key = element.name.replace(/ /gi, '_');
          element.amount = this.convertToTwoDecimal(value[value.length - 1][this.baseYear]);
          element.percent = this.convertToTwoDecimal(value[value.length - 1][cagrKey]);
          element.open = true;
          element.color = '#999';

          this.regions.open = true;
          this.regions.color = '#999';

          element.children.forEach(el => {
            value.forEach(x => {
              if (x[parent_key.toLowerCase()] == el.name || x[parent_key] == el.name) {
                el.amount = this.convertToTwoDecimal(x[this.baseYear]);
                el.percent = this.convertToTwoDecimal(x[cagrKey]);
                el.color = '#999';
              }
            });
          });
        }
        if (element.children) {
          this.changeColor(element.children);
        }
      });
    }
  }

  getSegmentDataSuccess(data: any, segmentId) {
    if (data && data.data && data.data[0] && data.data[0].value) {
      if (!this.metric && data.data[0].metric) {
        this.metric = data.data[0].metric;
        if (this.metric == 'Kilo Tons') {
          this.metric = data.data[0].metric;
        } else {
          this.metric = 'USD ' + this.metric;
        }
      }
      let value = data.data[0].value;

      this.treeData.children.forEach(element => {

        if (element.id == segmentId) {
          let allKeys = Object.keys(value[value.length - 1]);
          let cagrKey = '';
          let parent_key = '';
          let parent_name = element.name;

          allKeys.forEach(ele => {
            if (ele.includes('CAGR (%) ')) {
              cagrKey = ele;
            } else if (ele.includes('_parent')) {
              parent_key = ele;
            }
          });
          element.amount = this.convertToTwoDecimal(value[value.length - 1][this.baseYear]);
          element.percent = this.convertToTwoDecimal(value[value.length - 1][cagrKey]);
          element.open = true;
          element.color = '#999';

          this.regions.amount = this.convertToTwoDecimal(value[value.length - 1][this.baseYear]);
          this.regions.percent = this.convertToTwoDecimal(value[value.length - 1][cagrKey]);
          this.treeData.open = true;
          this.treeData.color = '#999';

          element.children.forEach(el => {

            value.forEach(x => {
              let newName = el.name.replace(/ /gi, '_').toLowerCase();
              newName = newName.replace(/&/gi, 'and');
              newName = newName.replace(/-/gi, '_');
              newName = newName.replace(/,/gi, '_');
              newName = newName.replace(/\(/gi, '');
              newName = newName.replace(/\)/gi, '');
              newName = newName.replace(/\./gi, '_');

              if (x[parent_key] == el.name || x[parent_key] == newName) {
                el.amount = this.convertToTwoDecimal(x[this.baseYear]);
                el.percent = this.convertToTwoDecimal(x[cagrKey]);
                el.color = '#999';
              }
            });
            if (el.children && el.children.length) {
              let bifurcation_parent_key = parent_name + ' ' + el.name;
              bifurcation_parent_key = bifurcation_parent_key.replace(/ /gi, '_').toLowerCase();
              bifurcation_parent_key = bifurcation_parent_key.replace(/&/gi, 'and');
              bifurcation_parent_key = bifurcation_parent_key.replace(/-/gi, '_');
              bifurcation_parent_key = bifurcation_parent_key.replace(/,/gi, '_');
              bifurcation_parent_key = bifurcation_parent_key.replace(/\(/gi, '');
              bifurcation_parent_key = bifurcation_parent_key.replace(/\)/gi, '');
              bifurcation_parent_key = bifurcation_parent_key.replace(/\./gi, '_');
              let key = bifurcation_parent_key + '_' + 'value';
              const result = _.find(this.meData, ['key', key]);

              if (result && result.value) {
                let bifurcation_value = result.value;

                el.children.forEach(e => {
                  bifurcation_value.forEach(x => {
                    let newName = e.name.replace(/ /gi, '_').toLowerCase();
                    newName = newName.replace(/&/gi, 'and');
                    newName = newName.replace(/-/gi, '_');
                    newName = newName.replace(/,/gi, '_');
                    newName = newName.replace(/\(/gi, '');
                    newName = newName.replace(/\)/gi, '');
                    newName = newName.replace(/\./gi, '_');
                    if (x[bifurcation_parent_key] == e.name || x[bifurcation_parent_key] == newName) {
                      e.amount = this.convertToTwoDecimal(x[this.baseYear]);
                      e.percent = this.convertToTwoDecimal(x[cagrKey]);
                      e.color = '#999';
                      e.open = false;
                    }
                  });
                });
              } else {
                el.children.forEach(e => {
                  e.color = '#999';
                  e.open = false;
                });
              }
            }
          });
        }
        if (element.children) {
          this.changeColor(element.children);
        }
      });
    }
  }

  convertToTwoDecimal(val) {
    if (!isNaN(val)) {
      return parseFloat(val).toFixed(2);
    } else {
      return val;
    }
  }

  analyze() {
    this.analyzeData = {
      reportId: this.reportId,
      tabSelected: '',
      subSegmentSelected: ''
    };
    this.sharedAnalyticsService.data = this.analyzeData;
    this.routes.navigateByUrl('/dashboard');
  }

  openDroctDialog() {
    let sendData = {
      data: this.treeData,
      baseYear: this.baseYear,
      metric: this.metric
    };
    const dialogRef = this.dialog.open(MarketEstimationDialogComponent, {
      width: '99%',
      data: sendData,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  orgCharts(regions) {
    let temporaryThis = this;
    (function($, JSONLoop) {

      $(function() {
        var datasource = {};
        temporaryThis.data.forEach(function(item, index) {
          if (!item.pid) {
            delete item.pid;
            Object.assign(datasource, item);
          } else {
            var jsonloop = new JSONLoop(datasource, 'id', 'children');
            jsonloop.findNodeById(datasource, item.pid, function(err, node) {
              if (err) {
                console.error(err);
              } else {
                delete item.pid;
                if (node.children) {
                  node.children.push(item);
                  const b = 2;
                } else {
                  node.children = [item];
                  var a = 1;
                }
              }
            });
          }
        });
        var getId = function() {
          return (new Date().getTime()) * 1000 + Math.floor(Math.random() * 1001);
        };
        temporaryThis.treeData = datasource;
        temporaryThis.requestMarketBreakupDataService.getMarketBreakupDataService(temporaryThis.reportId, temporaryThis.regions, temporaryThis.treeData).subscribe(d => {
          let segmentData = [];
          let regionData = [];
          if (d && d[0]) {
            regionData = d[0];
            temporaryThis.regions.children.forEach((element, i) => {
              temporaryThis.getRegionDataSuccess(regionData[i], element.id);
            });
          }
          if (d && d[1]) {
            segmentData = d[1];
            if (temporaryThis.treeData.children.length == segmentData.length) {
              temporaryThis.treeData.children.forEach((element, i) => {
                temporaryThis.getSegmentDataSuccess(segmentData[i], element.id);
              });
            }
          }
          temporaryThis.treeData.children.push(temporaryThis.regions);
          temporaryThis.createChart(temporaryThis.treeData, 0);
        });
      });


    })($, JSONLoop);

  }

  createRegions(regions) {
    this.regionData = [];
    regions.forEach(element => {
      let temp = {
        id: element.id,
        name: element.region,
        children: element.countries
      };
      this.regionData.push(temp);
    });
    this.regions = {
      id: '1',
      name: 'Region',
      children: this.regionData
    };
  }

  changeColor(e) {
    let array = [];

    e.forEach(x => {
      array.push(parseInt(x.amount));
    });
    let max = Math.max(...array);

    e.forEach(x => {
      if (parseInt(x.amount) == max) {
        x.color = 'green';
      }
      if (x.children) {
        this.changeColor(x.children);
      }
    });
  }

  createChart(treeData, cnt) {
    var margin = {top: 5, right: 230, bottom: 10, left: 230},
      width = 800 - margin.right - margin.left,
      height = 380 - margin.top - margin.bottom;

    var svg = d3.select('#dendo-container')
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
    root = d3.hierarchy(treeData, function(d) {
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
        .data(nodes, function(d) {
          return d.id || (d.id = ++i);
        });


      // Enter any new modes at the parent's previous position.
      var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', function(d) {
          return 'translate(' + source.y0 + ',' + source.x0 + ')';
        })
        .on('click', click);

      // Add Circle for the nodes
      nodeEnter.append('image')
        .attr('href', function(d) {
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
        .style('fill', function(d) {
          return d._children ? 'lightsteelblue' : '#fff';
        })
        .style('color', '#000');

      // Add labels for the nodes
      nodeEnter.append('text')
        .attr('x', function(d) {
          return d.children || d._children ? 10 : 10;
        })
        .attr('dy', function(d) {
          return d.children || d._children ? '-1em' : '0.5em';
        })
        .attr('text-anchor', function(d) {
          return d.children || d._children ? 'end' : 'start';
        })
        .text(function(d) {
          let percent = '';
          if (d && d.data && d.data.percent) {
            percent = d.data.percent;
            percent = percent.replace('%', '');
          }
          let name = '';
          if (d.data.name) {
            name = d.data.name.substring(d.data.name.indexOf('_') + 1);
          }
          if (d.depth == 0) {
            return name;
          } else if (d.depth == 3) {
            if (typeof d.data.amount === 'undefined') {
              return name;
            } else {
              return name + ', ' + d.data.amount + ', ' + percent + '%';
            }
          } else {
            return name + ', ' + d.data.amount + ', ' + percent + '%';
          }
        })
        .style('fill-opacity', 1e-6)
        .style('font', '10px sans-serif')
        .style('font-weight', function(d) {
          return d.data.percent >= 70 ? 'bold' : 'normal';
        });

      // UPDATE
      var nodeUpdate = nodeEnter.merge(node);

      // Transition to the proper position for the node
      nodeUpdate.transition()
        .duration(duration)
        .attr('transform', function(d) {
          return 'translate(' + d.y + ',' + d.x + ')';
        });

      // Update the node attributes and style
      nodeUpdate.select('image')
        // .attr("r", 4.5)
        // .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
        .attr('href', function(d) {
          return !(d.children || d._children) ? '' : d.data.open == true ? '../../assets/images/remove.png' : '../../assets/images/add.png';
        });

      nodeUpdate.select('text')
        .style('fill-opacity', 1);


      // Remove any exiting nodes
      var nodeExit = node.exit().transition()
        .duration(duration)
        .attr('transform', function(d) {
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
        .data(links, function(d) {
          return d.id;
        });

      // Enter any new links at the parent's previous position.
      var linkEnter = link.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr('fill', 'none')
        .attr('stroke-width', function(d) {
          if (d.data.color == 'green') {
            return '2px';
          } else {
            return '1px';
          }
        })
        .attr('stroke', function(d) {

          return d.data.color;
        })
        .attr('d', function(d) {
          var o = {x: source.x0, y: source.y0};
          return diagonal(o, o);
        });

      // UPDATE
      var linkUpdate = linkEnter.merge(link);

      // Transition back to the parent element position
      linkUpdate.transition()
        .duration(duration)
        .attr('d', function(d) {
          return diagonal(d, d.parent);
        });

      // Remove any exiting links
      var linkExit = link.exit().transition()
        .duration(duration)
        .attr('d', function(d) {
          var o = {x: source.x, y: source.y};
          return diagonal(o, o);
        })
        .remove();

      // Store the old positions for transition.
      nodes.forEach(function(d) {
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
    this.spinner.hide();
  }
}

