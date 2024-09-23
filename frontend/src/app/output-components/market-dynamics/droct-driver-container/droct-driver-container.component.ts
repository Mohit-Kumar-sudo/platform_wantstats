import {Component, OnInit, ElementRef, ViewChild, TemplateRef, AfterViewInit, OnDestroy} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import * as d3 from 'd3';
import * as html2canvas from 'html2canvas';
import {ActivatedRoute, Router} from '@angular/router';
import {ReportService} from 'src/app/services/report.service';
import {ReportSectionService} from 'src/app/services/report-section.service';
import * as pieConfig from '../../../components/core/pie-chart-input/pie-chart-configs';
import * as barConfig from '../../../components/core/bar-chart-input/bar-chart-configs';
import {LocalStorageService} from 'src/app/services/localstorage.service';
import {ConstantKeys} from 'src/app/constants/mfr.constants';
import * as _ from 'lodash';
import {CommonChartContainerComponent} from '../../common-chart-container/common-chart-container.component';
import {DriversOutputDialogComponent} from '../drivers-output-dialog/drivers-output-dialog.component';
import {ExcelDownloadService} from 'src/app/services/excel-download.service';
import {SharedAnalyticsService} from 'src/app/services/shared-analytics.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {PptService} from '../../../services/ppt.service';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-droct-driver-container',
  templateUrl: './droct-driver-container.component.html',
  styleUrls: ['./droct-driver-container.component.scss']
})
export class DroctDriverContainerComponent implements OnInit, AfterViewInit, OnDestroy {

  ratingData: any = [];
  contentData: any = [];
  reportDetails: any;
  sectionDetails: any;
  droctName: any = [];
  showYear;
  cnt;
  analyzeData: any;
  sendSuggest: any;

  @ViewChild('screenPie') screenPie: ElementRef;
  @ViewChild('screenBar') screenBar: ElementRef;
  @ViewChild('screenImg') screenImg: ElementRef;
  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  reportData: any = [];
  reportName: any;
  startYear: any;
  endYear: any;
  reportId: any;
  types: any;
  finalObject: any = [];

  pieChartType = pieConfig.pieChartType;
  pieChartOptions = pieConfig.pieChartOptions;
  pieChartPlugins = pieConfig.pieChartPlugins;
  pieChartColors = pieConfig.pieChartColors;
  pieChartLegend = pieConfig.pieChartLegend;

  barChartType = barConfig.barChartType;
  barChartOptions = barConfig.barChartOptions;
  barChartPlugins = barConfig.barChartPlugins;
  barChartLegend = barConfig.barChartLegend;
  droctType: any;
  open = false;
  driverInterval: any;
  typeParam: any;

  keyword: any;

  interConnectData = {
    'section': '',
    'data': []
  };
  reportConnectData = {
    'section': '',
    'data': []
  };
  overlaps: any;
  permissions: any;

  constructor(
    public dialog: MatDialog,
    public routes: Router,
    public activateRoutes: ActivatedRoute,
    public reportService: ReportService,
    private authService: AuthService,
    public reportSectionService: ReportSectionService,
    public spinner: NgxSpinnerService,
    private pptService: PptService,
    public localStorageService: LocalStorageService,
    private excelDownloadService: ExcelDownloadService,
    private sharedAnalyticsService: SharedAnalyticsService
  ) {
    this.permissions = this.authService.getUserPermissions();
    this.reportDetails = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    this.sectionDetails = this.localStorageService.get(ConstantKeys.CURRENT_SECTION);
    activateRoutes.queryParams.subscribe(
      params => this.typeParam = params['type']);
  }

  downloadPpt(data) {
    this.pptService.downloadPPT(data);
  }

  addSlideToPPT(data) {
    this.pptService.addSlideToPPT(data);
  }

  getReportDetailsSuccess(data, type) {

    data.map(d => {
      if (d.meta && d.meta.type === type.toUpperCase()) {
        this.ratingData.push(d.meta.data);
      }
      if (d.meta_info.parent_section_key === type.toLowerCase()) {
        this.contentData.push(d);
      }
    });

    if (this.contentData && this.contentData.length && this.ratingData && this.ratingData.length) {
      this.contentData.map(d => {
        // this.droctName.push(_.upperFirst(_.toLower(d.meta.data.name)));
        this.droctName.push(d.meta.data.name);
        if (d.content) {
          let contentDatas = this.reportSectionService.convertToReportDataElement(d.content);
          this.reportData.push(contentDatas);
        }
      });
      let demoData = this.ratingData;
      if (this.ratingData.length > 0) {
        if (this.ratingData[0].rating.length) {
          let years = _.map(this.ratingData[0].rating, 'year');
          years.forEach(y => {
            let ob = {
              name: this.droctType,
              year: y,
              children: [],
              types: this.types
            };
            demoData.forEach(rd => {
              if (rd.rating.length > 0) {
                const r = _.find(rd.rating, ['year', y]);
                ob.children.push(
                  {
                    name: rd.name,
                    rating: r ? r.rating : 5
                  });
                ob.children = _.uniqBy(ob.children, 'name');
              }
            });
            this.finalObject.push(ob);
          });
          this.generateTrees();
        } else {
          let years = [];
          for (let i = this.startYear; i <= this.endYear; i++) {
            years.push(i);
          }
          if (years.length) {
            years.forEach(y => {
              let ob = {
                name: this.droctType,
                year: y,
                children: [],
                types: this.types
              };
              demoData.forEach(rd => {
                ob.children.push(
                  {
                    name: rd.name,
                    rating: 5
                  });
                ob.children = _.uniqBy(ob.children, 'name');
              });
              this.finalObject.push(ob);
            });
            this.generateTrees();
          }
        }
      }
     window.scroll(0,0)
    } else {
      this.routes.navigate(['driveroutput']);
    }
    this.spinner.hide();
  }

  generateImage(type, data = null) {
    if (!this.permissions.imageExport) {
      return this.authService.showNotSubscribedMsg();
    }
    if (type === 'PIE') {
      // @ts-ignore
      html2canvas(this.screenPie.nativeElement).then(canvas => {
        this.canvas.nativeElement.src = canvas.toDataURL();
        this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
        this.downloadLink.nativeElement.download = data.data.metaDataValue.title;
        this.downloadLink.nativeElement.click();
      });
    } else if (type === 'BAR') {
      // @ts-ignore
      html2canvas(this.screenBar.nativeElement).then(canvas => {
        this.canvas.nativeElement.src = canvas.toDataURL();
        this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
        this.downloadLink.nativeElement.download = data.data.metaDataValue.title;
        this.downloadLink.nativeElement.click();
      });
    } else if (type === 'IMAGE') {
      // @ts-ignore
      html2canvas(this.screenImg.nativeElement).then(canvas => {
        this.canvas.nativeElement.src = canvas.toDataURL();
        this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
        this.downloadLink.nativeElement.download = data.data.metaDataValue.title;
        this.downloadLink.nativeElement.click();
      });
    } else {
      // @ts-ignore
      html2canvas(this.screen.nativeElement).then(canvas => {
        this.canvas.nativeElement.src = canvas.toDataURL();
        this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
        this.downloadLink.nativeElement.download = 'Image.png';
        this.downloadLink.nativeElement.click();
      });
    }
  }

  analyze() {

    this.analyzeData = {
      reportId: this.reportId,
      tabSelected: this.typeParam,
      subSegmentSelected: ''
    };
    this.sharedAnalyticsService.data = this.analyzeData;
    this.routes.navigateByUrl('/dashboard');
  }

  openDialog(data) {
    const dialogRef = this.dialog.open(CommonChartContainerComponent, {
      width: '98%',
      data: data,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(result => {
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
        this.driverInterval = d3.interval(() => {
          if (this.finalObject.length > 0) {
            this.cnt = (this.cnt + 1 + length) % length;
            d3.select('#driver-container svg').remove();
            this.renderTree(this.finalObject[this.cnt]);
            this.showYear = this.finalObject[this.cnt].year;
          }
        }, 1000);
      }
    }
  }

  renderTree(treeData) {
    var margin = {top: 5, right: 400, bottom: 10, left: 100},
      width = 800 - margin.right - margin.left,
      height = 260 - margin.top - margin.bottom;

    var svg = d3.select('#driver-container')
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
        .data(nodes, function(d) {
          return d.id || (d.id = ++i);
        });

      // Enter any new modes at the parent's previous position.
      var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', function(d) {
          return 'translate(' + source.y0 + ',' + source.x0 + ')';
        });

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
        .attr('fill', 'black')
        .attr('text', '+')
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
          return d.children || d._children ? 'middle' : 'start';
        })
        .text(function(d) {
          if (d.data.rating == 5) {
            return d.data.name;
          } else {
            return d.data.rating > 5 && d.data.rating <= 10 ? (d.data.rating > 5 && d.data.rating <= 7) ? d.data.name + ' (medium impact)' : d.data.name + ' (high impact )' : d.depth > 0 ? d.data.name + ' (low impact)' : d.data.name;
          }
        })
        .style('fill-opacity', 1e-6)
        .style('font', '12px sans-serif')
        .style('font-weight', function(d) {
          return d.data.percent >= 70 ? 'bold' : 'normal';
        })
        .call(wrap, 380);

      // UPDATE
      var nodeUpdate = nodeEnter.merge(node);

      // Transition to the proper position for the node
      nodeUpdate
        //   .duration(duration)
        .attr('transform', function(d) {
          return 'translate(' + d.y + ',' + d.x + ')';
        });

      // Update the node attributes and style
      nodeUpdate.select('image')
        // .attr("r", 4.5)
        // .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
        .attr('href', function(d) {
          return !(d.children || d._children) ? '' : d.data.rating > 0 ? '../../assets/images/' + d.data.rating + '.png' : d.data.open == true ? '../../assets/images/remove.png' : '../../assets/images/add.png';
        });

      nodeUpdate.select('text')
        .style('fill-opacity', 1);


      // Remove any exiting nodes
      var nodeExit = node.exit()
        // .duration(duration)
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
          return 0.5 * d.data.rating + 'px';
        })
        .attr('stroke', function(d) {
          return d.data.rating >= 4 && d.data.rating <= 10 ? (d.data.rating >= 4 && d.data.rating < 8) ? '#999' : 'red' : 'green';
        })
        .attr('d', function(d) {
          var o = {x: source.x0, y: source.y0};
          return diagonal(o, o);
        });

      // UPDATE
      var linkUpdate = linkEnter.merge(link);

      // Transition back to the parent element position
      linkUpdate
        // .duration(duration)
        .attr('d', function(d) {
          return diagonal(d, d.parent);
        });

      // Remove any exiting links
      var linkExit = link.exit()
        //  .duration(duration)
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

      function wrap(text, width) {
        text.each(function() {

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

  ngOnInit() {
    this.spinner.show();
    this.ratingData = [];
    this.finalObject = [];
    this.contentData = [];
    this.reportData = [];
    this.droctName = [];
    d3.select('#driver-container').selectAll('svg').remove();
    if (this.driverInterval) {
      this.driverInterval.stop();
    }
    this.activateRoutes.queryParams.subscribe(params => {
      this.spinner.show();
      this.ratingData = [];
      this.finalObject = [];
      this.contentData = [];
      this.reportData = [];
      this.droctName = [];
      d3.select('#driver-container').selectAll('svg').remove();
      this.showYear = null;
      this.types = params['type'].toLowerCase();
      this.droctType = params['type'];

      const currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
      this.reportName = currentReport.title;
      this.startYear = currentReport.me.start_year;
      this.endYear = currentReport.me.end_year;
      this.reportId = currentReport._id;

      if (currentReport.overlaps) {
        this.overlaps = currentReport.overlaps;

        let interConnect = this.overlaps.filter(e => e.section_name == this.droctType);

        if (interConnect.length) {
          let dt = {
            'section': '',
            'data': []
          };
          if (interConnect[0].data && interConnect[0].data.length) {
            if (interConnect[0].section_name) {
              dt.section = interConnect[0].section_name;
              for (let i = 0; i < interConnect[0].data.length && i < 2; i++) {
                dt.data.push(interConnect[0].data[i]);
              }
            }
          }

          this.interConnectData = dt;
        }
        let reportConnect = this.overlaps.filter(e => e.section_name == 'Report');

        if (reportConnect.length) {
          let dt = {
            'section': '',
            'data': []
          };
          if (reportConnect[0].data && reportConnect[0].data.length) {
            if (reportConnect[0].section_name) {
              dt.section = reportConnect[0].section_name;
              for (let i = 0; i < reportConnect[0].data.length && i < 2; i++) {
                dt.data.push(reportConnect[0].data[i]);
              }
            }
          }

          this.reportConnectData = dt;
        }
      }

      if (this.activateRoutes.snapshot.queryParams) {
        if (this.activateRoutes.snapshot.queryParams['reportId']) {
          this.reportId = this.activateRoutes.snapshot.queryParams['reportId'];
          this.reportService.setReportData(this.reportId);
        }
        if (this.activateRoutes.snapshot.queryParams['reportName']) {
          this.reportName = this.activateRoutes.snapshot.queryParams['reportName'];
        }
      }
      const sectionKey = 'MARKET_DYNAMICS';
      this.reportService.getSectionKeyDetials(this.reportId, sectionKey).subscribe(data => {
        this.getReportDetailsSuccess(data, this.types);
        window.scroll(0,0)
      }, error => {
        console.log('error', error);
      });
    });
  }

  ngAfterViewInit() {
  }

  openDroctDialog() {
    const dialogRef = this.dialog.open(DriversOutputDialogComponent, {
      width: '99%',
      data: this.finalObject,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  ngOnDestroy() {
    this.ratingData = [];
    this.finalObject = [];
    this.contentData = [];
    this.droctName = [];
    this.reportData = [];
    d3.select('#driver-container').selectAll('svg').remove();
  }

  downloadExcel(dataElement) {
    this.excelDownloadService.downloadExcel(dataElement);
  }
}

