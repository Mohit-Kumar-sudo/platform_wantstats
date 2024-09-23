import {Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {ConstantKeys} from '../../constants/mfr.constants';
import {FormArray, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {DashboardModalComponent} from './dashboard-modal/dashboard-modal.component';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ReportService} from '../../services/report.service';
import {LocalStorageService} from '../../services/localstorage.service';
import * as _ from 'lodash';
// import * as chartConfig from './../../sharedCharts/sharedColumnBarChart/column-bar-chart-configs';
import * as chartConfig from './../../../app/components/core/bar-chart-input/bar-chart-configs';
import * as d3 from 'd3';
import * as mermaid from 'mermaid';
import {RadarChartService} from 'src/app/services/radar-chart.service';
import * as html2canvas from 'html2canvas';
import {DashboardPanelComponent} from './dashboard-panel/dashboard-panel.component';
import {companyProfileService} from 'src/app/services/companyprofile.service';
import {barChartOptions} from 'src/app/components/core/bar-chart-input/bar-chart-configs';
import {getChartOptions} from '../../sharedCharts/sharedColumnBarChart/column-bar-chart-configs';
import {SharedAnalyticsService} from 'src/app/services/shared-analytics.service';
import {ExcelDownloadService} from 'src/app/services/excel-download.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import {DashboardSaveComponent} from './dashboard-save/dashboard-save.component';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../services/user.service';
import { AuthService } from 'src/app/services/auth.service';
declare var JSONLoop: any;
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  myControl = new FormControl();
  myControlCompany = new FormControl();
  filteredOptions: Observable<any[]>;
  companyFilteredOptions: Observable<any[]>;
  chartConfigs: any;
  dashboardBarChartOptions: any = [];
  chartData: any = [];
  permissions: any;
  chartLabels: any = [];
  barChartData: any = [];
  panelYears: any = [];
  panelRegions: any = [];
  panelCountries: any = [];
  panelSegments: any = [[], [], [], []];
  regions: any = [];
  countries: any = [];
  years: any = [];
  panelForm: FormGroup;
  panelData: any = [];
  reportData: any = [];
  buttonSelected: any = [];
  reportFilterData: any = [];
  ratingData: any = [];
  finalObject: any = [];
  cnt = [];
  showYear: any = [];
  dType: any;
  interval: any = [];
  chainType: any = [];
  paths: any = [];
  nodes: any = [];
  chartText: any = [];
  svgCode: any = [];
  portersDropDown = [];
  element: any;
  threatOfNewEntrantsRating: any = [];
  bargainingPowerOfSuppliersRating: any = [];
  threatOfSubstitutesRating: any = [];
  bargainingPowerOfBuyersRating: any = [];
  segmentRivalryRating: any = [];
  portersModules: any = [];
  htmlElement: HTMLElement;
  threats: any = [];
  suppliers: any = [];
  segments: any = [];
  buyers: any = [];
  substitutes: any = [];
  modulesData = [{
    bargainingPowerOfBuyersRating: 0,
    bargainingPowerOfSuppliersRating: 0,
    name: '',
    segmentRivalryRating: 0,
    threatOfNewEntrantsRating: 0,
    threatOfSubstitutesRating: 0
  }];
  selectedPorters: any = [];
  portersId: any = [];
  segmentsData: any = [];
  disRegion: any = [];
  disCountry: any = [];
  disSegment: any = [];
  disYear: any = [];
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  @ViewChild('mermaid') mermaid: ElementRef;
  companyData: any = [];
  contentFOList: any = [];
  bySBU: any = [];
  byVertical: any = [];
  selectFOData: any = [];
  byRegion: any = [];
  dataStoreFO: any = [];
  labelXFO: any = [];
  colMetaDataFO: any = [];
  rowNamesFO: any = [];
  labelYFO: any = [];
  chartOptions: any = [];
  chartDataFO: any = [];
  chartLabelsFO: any = [];
  renderBar: any = [];
  FoYears: any = [];
  FoPanelYears: any = [];
  FoData: any = [];
  poData: any = [];
  SWOTData: any = [];
  strength: any = [];
  weakness: any = [];
  opportunity: any = [];
  threat: any = [];
  hidder: any = [];
  searchReportText: any = [];
  searchingReportData: any = [];
  allReports: any = [];
  allCompanies: any = [];
  dashboardData: any;
  currentReport: any;
  selectedHeading: any = [];
  selectedCompany: any = [];
  sharedData: any;
  displayStyle = "none";

  constructor(private fb: FormBuilder,
              public toastr: ToastrService,
              private localStorageService: LocalStorageService,
              private spinner: NgxSpinnerService,
              private reportService: ReportService,
              private authService: AuthService,
              private dialog: MatDialog,
              private userService: UserService,
              private routes: ActivatedRoute,
              private chartService: RadarChartService,
              private companyProfileService: companyProfileService,
              private sharedAnalyticsService: SharedAnalyticsService,
              private excelDownloadService: ExcelDownloadService,
              private formBuilder: FormBuilder
  ) { this.panelForm = this.formBuilder.group({
    countries: [''] // Initialize the 'countries' form control
  });
}

  loadDashboard(id) {
    this.userService.getUserDashboards(id).subscribe(data => {
      if (data && data.data) {
        this.dashboardData = data.data.myDashboards[0];
        this.dashboardData.panels.forEach(item => {
          this.addPanel(item.reportId, true);
        });
      } else {
        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
    });
  }

  initPanels() {
    return this.fb.group({
      years: [],
      regions: [''],
      countries: [''],
      portersDropDown: [''],
      searchReportText: [''],
      searchCompanyText: [''],
      FinancialOverview: ['']
    });
  }

  searchReport(index) {
    this.reportService.getSearchReportsByName(this.searchReportText[index]).subscribe(data => {
      if (data && data.data) {
        this.searchingReportData[index] = data.data;
      }
    });
  }

  onReportSelect(report, i) {
    // console.log("selected report",report,i)
    // this.spinner.show();
    this.getReportDetails(report._id, i);
  }

  onCompanySelect(company, i) {
    this.selectedCompany[i] = [];
    this.selectedCompany[i] = company;
  }


  ngOnInit() {
    this.panelForm = this.formBuilder.group({
      panelItems: this.formBuilder.array([
        this.formBuilder.group({
          countries: [''] // Define your form control 'countries' here
        })
      ]) // Initialize panelItems as a FormArray
    });
    this.permissions = this.authService.getUserPermissions();
    window.scroll(0,0)
    // this.spinner.show();
    this.sharedData = this.sharedAnalyticsService.data;
    for (let i = 0; i <= 3; i++) {
      this.panelRegions[i] = [];
      this.regions[i] = [];
    }
    this.currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    //  console.log("this.currentReport", this.currentReport)
    if(!this.currentReport){
      this.openPopup()
    }
    this.chartConfigs = chartConfig;
    this.panelForm = this.fb.group({
      panelItems: this.fb.array([]),
    });
    this.hidder[0] = true;
     this.myControl.valueChanges.subscribe((term)=>{
      if (term != "") {
        this.reportService.getMainReportsByName(term).subscribe((data) => {
          if (data) {
            // console.log("filtered data",data)
            this.filteredOptions = data
          }
        })
      }
    })
      // console.log(" this.filteredOptions", this.filteredOptions)

    this.companyFilteredOptions = this.myControlCompany.valueChanges.pipe(
      startWith(''),
      map(value => this._companyFilter(value))
    );

    this.reportService.getAll().subscribe(data => {
      this.allReports = data;
      this.allReports.forEach(item => {
        item.title = item.title + ' Market';
      });
    });

    this.companyProfileService.getAllCompanies().subscribe(data => {
      data.forEach(item => {
        if (item) {
          this.allCompanies.push(item);
        }
      });
    });
    if (this.routes.snapshot.queryParams['dashboardId']) {
      this.loadDashboard(this.routes.snapshot.queryParams['dashboardId']);
    } else {
      this.addPanel();
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allReports.filter(option => option.title.toLowerCase().includes(filterValue));
  }

  private _companyFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allCompanies.filter(option => option.company_name.toLowerCase().includes(filterValue));
  }

  getReportDetails(reportId, i, isOldPanel = false) {
    this.reportService.getById(reportId).subscribe(
      data => {
        // console.log("getReportDetails data", data)
       window.scroll(0,0)
        data.title = data.title + ' Market';
        this.reportData[i] = data;
      }, error => {
        this.spinner.hide();
        this.toastr.error(error.error.message);
      }
    );

    this.reportService.getReportDataBySelectMe(reportId, '').subscribe(data => {
    //  console.log("getReportDataBySelectMe data2",data)
      if (data && data.data && data.data[0] && data.data[0].me && data.data[0].me.geo_segment) {
        let allAPIRegions = data.data[0].me.geo_segment;
        this.regions[i] = allAPIRegions;
        this.panelRegions[i] = _.map(allAPIRegions, 'region');
        this.years[i] = _.range(data.data[0].me.start_year, data.data[0].me.end_year + 1);
        this.panelYears[i] = this.years[i];
        const regCountries = _.map(allAPIRegions, 'countries');
        this.countries[i] = [];
        if (regCountries) {
          regCountries.forEach(regCountry => {
            if (regCountry) {
              regCountry.forEach(rC => {
                this.countries[i].push(rC);
              });
            }
          });
        }
        this.panelCountries[i] = _.map(this.countries[i], 'name');
      }
      // this.reportService.getReportDataBySelectMe(reportId, 'data').subscribe(datadata => {
      if (data && data.data && data.data[0] && data.data[0].me && data.data[0].me.data) {
        this.reportFilterData[i] = _.remove(data.data[0].me.data, null);
      }
      this.segmentsData[i] = [];
      if (this.reportFilterData[i]) {
        let metric = "";
        if (this.reportFilterData[i][0] && this.reportFilterData[i][0].metric) {
          metric = this.reportFilterData[i][0].metric;
          if (metric != 'Kilo Tons') {
            metric = 'USD ' + metric
          }
        }
        this.dashboardBarChartOptions[i] = getChartOptions('Year', metric);
        this.reportFilterData[i].forEach(item => {
          if (item.key.includes('_parent_value') && !item.key.startsWith('geography')) {
            // console.log(`item`, item)
            const segName = _.toLower(item.key.replace('_parent_value', ''));
            const obj = {
              segmentName: _.startCase(segName).split('_').join(' '),
              values: [],
              isDisable: false
            };
            const keyData = segName + '_parent';
            item.value.forEach(val => {
              if (val[keyData] != 'Total') {
                val.segmentName = val[keyData];
                obj.values.push(val);
              }
            });
            this.segmentsData[i].push(obj);
          }
        });
        // console.log('data.data[0].me.segment',data.data[0].me.segment)
        const segments = _.filter(data.data[0].me.segment, ['pid', '1']);
        segments.forEach(item => {
          const subSegs = _.filter(data.data[0].me.segment, ['pid', item.id]);
          subSegs.forEach(subSeg => {
            const superSubSegs = _.filter(data.data[0].me.segment, ['pid', subSeg.id]);
            if (superSubSegs && superSubSegs.length) {
              const obj = {
                segmentName: subSeg.name,
                values: [],
                isDisable: false
              };
              const tempKey = _.toLower(item.name + `_` + subSeg.name).split(' ').join('_').split('(').join('').split(')').join('').split('&').join('and').split('-').join('_') + `_value`;
              const tempData = _.find(this.reportFilterData[i], [`key`, tempKey]);
              if (tempData) {
                const keyData = tempKey.replace(`_value`, ``);
                // console.log(keyData)
                tempData.value.forEach(val => {
                  if (val[keyData] != 'Total') {
                    val.segmentName = val[keyData];
                    obj.values.push(val);
                  }
                });
                this.segmentsData[i].push(obj);
              }
            }
          });
        });
        this.panelSegments[i] = _.map(this.segmentsData[i][0].values, 'segmentName');
      }
      this.spinner.hide();
      if (isOldPanel) {
        this.setValuesForExistingPanels(i);
        this.applyFilter(i);
      } else {
        this.applyFilter(i);
      }
      // });
    });
  }

  setValuesForExistingPanels(index) {
    const controlsData = this.dashboardData.panels[index].data
    this.panelCountries[index] = controlsData.selectedCountries;
    this.panelRegions[index] = controlsData.selectedRegions;
    this.buttonSelected[index] = controlsData.selectedTab;
    this.panelYears[index] = controlsData.selectedYears;
  }

  selectRegion(index) {
    this.hidder[index] = true;
    this.disRegion[index] = false;
    this.disCountry[index] = false;
    this.disSegment[index] = false;
    this.disYear[index] = false;
    this.buttonSelected[index] = 'Region';
  }

  selectCountry(index) {
    this.hidder[index] = true;
    this.disRegion[index] = false;
    this.disCountry[index] = false;
    this.disSegment[index] = false;
    this.disYear[index] = false;
    this.buttonSelected[index] = 'Country';
  }

  selectSegment(segment, index) {
    this.hidder[index] = true;
    this.disRegion[index] = false;
    this.disCountry[index] = false;
    this.disSegment[index] = false;
    this.disYear[index] = false;
    this.buttonSelected[index] = segment.segmentName;
    this.panelSegments[index] = _.map(segment.values, 'segmentName');
  }

  applyFilter(index) {
    if (this.buttonSelected[index]) {
      if (this.buttonSelected[index] = 'Region') {
        this.selectedHeading[index] = 'Market Estimation';
        this.calculateFilterDataByRegion(index);
      } else if (this.buttonSelected[index] = 'Country') {
        this.selectedHeading[index] = 'Market Estimation';
        this.calculateFilterDataByCountry(index);
      } else if (this.buttonSelected[index] = 'Drivers') {
        this.selectedHeading[index] = 'Market Drivers';
        this.filterDrivers(index);
      } else if (this.buttonSelected[index] = 'Restraints') {
        this.selectedHeading[index] = 'Market Restraints';
        this.filterDrivers(index);
      } else if (this.buttonSelected[index] = 'FinancialOverview') {
        this.filterFO(index);
        this.selectedHeading[index] = 'Financial overview';
      } else {
        this.selectedHeading[index] = 'Market Estimation';
        this.calculateFilterDataBySegment(index);
      }
    }
  }

  calculateFilterDataBySegment(index) {
    this.barChartData[index] = [];
    this.barChartData[index].chartData = [];
    const result = _.find(this.segmentsData[index], ['segmentName', this.buttonSelected[index]]);
    result.values.forEach(item => {
      if (this.panelSegments[index].includes(item.segmentName)) {
        this.barChartData[index].chartData.push({
          label: item.segmentName,
          data: []
        });
      }
    });
    this.barChartData[index].chartLabels = this.panelYears[index].map(String);
    const segment = this.buttonSelected[index].toLowerCase();
    this.barChartData[index].chartData.forEach(item => {
      let sum = 0;
      let finalOb = [];
      this.panelYears[index].forEach(py => {
        finalOb.push({
          year: py,
          total: 0
        });
      });
      this.panelCountries[index].forEach(country => {
        const key = segment + '_' + country.toLowerCase() + '_value';
        const keyVal = key.split(' ').join('_');
        const keyData = _.find(this.reportFilterData[index], ['key', keyVal]);
        if (keyData) {
          keyData.value.forEach(keyValue => {
            let k = segment + '_' + country.toLowerCase();
            k = k.split(' ').join('_');
            if (keyValue[k] != 'Total' && item.label === keyValue[k]) {
              finalOb.forEach(py => {
                py.total = (parseFloat(py.total) + parseFloat(keyValue[py.year])).toFixed(2);
              });
            }
          });
        }
      });
      item.data = _.map(finalOb, 'total');
    });
  }

  panelCountryChanged(i, event) {
    if (event.length) {
      this.panelCountries[i] = _.map(event, 'name');
    } else {
      this.panelCountries[i] = [];
    }
  }

  panelRegionChanged(index, event = null) {
    if (event) {
      if (event.length) {
        this.panelRegions[index] = _.map(event, 'region');
      } else {
        this.panelRegions[index] = [];
      }
    }
    this.countries[index] = [];
    this.panelRegions[index].forEach(item => {
      const regionItem = _.find(this.regions[index], ['region', item]);
      this.countries[index] = _.concat(this.countries[index], regionItem.countries);
    });
    if (!this.panelRegions[index].length) {
      this.panelCountries[index] = [];
    }
  }

  addPanel(reportId = null, isOldPanel = false) {
    const control = this.panelForm.controls['panelItems'] as FormArray;
    if (control.controls.length < 4) {
      this.spinner.show();
      this.panelForm[control.controls.length] = '';
      control.push(this.initPanels());
      const index = control.controls.length - 1;
      this.selectedHeading[index] = '';
      this.buttonSelected[index] = 'Region';
      this.hidder[index] = true;
      this.selectedCompany[index] = '';
      if (reportId) {
        this.getReportDetails(reportId, index, isOldPanel);
      } else if (this.currentReport && this.currentReport._id) {
        this.getReportDetails(this.currentReport._id, index);
      } else {
        this.spinner.hide();
      }
      this.toastr.success('Panel Added Successfully', '');
    } else {
      this.toastr.error('Panel can not be added more than 4', '');
    }
  }

  removePanel(i) {
    const control = this.panelForm.controls['panelItems'] as FormArray;
    control.removeAt(i);
    if (i > -1) {
      this.panelData.splice(i, 1);
      this.panelCountries.splice(i, 1);
      this.panelRegions.splice(i, 1);
      this.panelYears.splice(i, 1);
      this.buttonSelected.splice(i, 1);
      this.reportData.splice(i, 1);
      this.panelSegments.splice(i, 1);
      this.barChartData.splice(i, 1);
      this.selectedHeading.splice(i, 1);
      // this.toastr.error('Panel removed successfully', '');
    }
    for (let j = 0; j < control.controls.length; j++) {
      this.applyFilter(j);
    }
  }

  getSelectedControls(index) {
    return {
      selectedTab: this.buttonSelected[index],
      selectedYears: this.panelYears[index],
      selectedRegions: this.panelRegions[index],
      selectedCountries: this.panelCountries[index],
      selectedPorters: this.selectedPorters[index],
      selectedFoYears: this.FoPanelYears[index],
      selectedFoData: this.selectFOData[index]
    };
  }

  getCombinedPanelsData() {
    const passingData = [];
    this.barChartData.forEach((item, index) => {
      passingData.push({
        panelTitle: 'Panel - ' + (index + 1) + ' (' + this.reportData[index].title + ')',
        barChartData: item,
        panelHeading: this.selectedHeading[index],
        dashboardBarChartOptions: this.dashboardBarChartOptions[index],
        marketDynamics: this.barChartData[index].marketDynamics,
        supplyChain: this.barChartData[index].supplyChain,
        porterDendrogram: this.barChartData[index].porterDendrogram,
        portersDiagram: this.barChartData[index].portersDiagram,
        productOffering: this.barChartData[index].productOffering,
        financialOverview: this.barChartData[index].FinancialOverview,
        SWOT: this.barChartData[index].SWOT,
        reportData: this.reportData[index],
        selectedControls: this.getSelectedControls(index)
      });
    });
    return passingData;
  }

  openDashboardModal() {
    const passingData = this.getCombinedPanelsData();
    const dialogRef = this.dialog.open(DashboardModalComponent, {
      width: '97%',
      maxWidth: '97vw',
      maxHeight: '97vh',
      panelClass: 'fullscreen-dashboard',
      data: passingData,
      disableClose: false,
    });
  }

  openPanel(index) {
    const passingData = {
      panelHeading: this.selectedHeading[index],
      barChartData: this.barChartData[index],
      dashboardBarChartOptions: this.dashboardBarChartOptions[index],
      marketDynamicsData: this.barChartData[index].marketDynamics,
      supplyChainData: this.barChartData[index].supplyChain,
      porterDendrogram: this.barChartData[index].porterDendrogram,
      porterDiagram: this.barChartData[index].portersDiagram,
      financialOverview: this.barChartData[index].FinancialOverview,
      productOffering: this.barChartData[index].productOffering,
      SWOT: this.barChartData[index].SWOT,
      reportData: this.reportData[index],
      typeButton: this.buttonSelected[index]
    };
    const dialogRef = this.dialog.open(DashboardPanelComponent, {
      width: '65%',
      data: passingData,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  openPorterPanel(index, switcher) {
    const passingData = {
      porterDiagram: this.barChartData[index].portersDiagram,
      reportData: this.reportData[index],
      typeButton: this.buttonSelected[index],
      switcher: switcher
    };
    const dialogRef = this.dialog.open(DashboardPanelComponent, {
      width: '65%',
      data: passingData,
      disableClose: false,
    });
  }

  download(index) {

  }

  saveDashboardData() {
    const dialogRef = this.dialog.open(DashboardSaveComponent, {
      width: '35%',
      data: this.getCombinedPanelsData(),
      disableClose: false,
    });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //   }
    // });
  }

  //Filter Data:
  calculateFilterDataByRegion(index) {
    this.barChartData[index] = [];
    this.buttonSelected[index] == 'Region';
    this.barChartData[index].chartData = [];
    if (this.panelRegions[index]) {
      if (this.panelSegments[index] && this.panelSegments[index].length) {
        let parentSegment = this.getParentSegmentName(this.segmentsData[index], this.panelSegments[index][0]);
        this.panelRegions[index].forEach(panelRegion => {
          this.barChartData[index].chartData.push({
            label: panelRegion,
            data: []
          });
        });
        this.barChartData[index].chartData.forEach(regionLabel => {
          const yearObj = [];
          this.panelYears[index].forEach(y => {
            yearObj.push({
              year: y,
              total: 0
            });
          });
          const regionCountries = _.map(_.find(this.regions[index], ['region', regionLabel.label]).countries, 'name');
          const finalCountries = _.intersection(regionCountries, this.panelCountries[index]);
          finalCountries.forEach(fC => {
            const outerKey = _.snakeCase(parentSegment + fC + ' value');
            const innerKey = _.snakeCase(parentSegment + fC);
            const countryValues = _.find(this.reportFilterData[index], ['key', outerKey]);
            if (countryValues) {
              this.panelSegments[index].forEach(ps => {
                const segmentData = _.find(countryValues.value, [innerKey, ps]);
                yearObj.forEach(yB => {
                  yB.total = (parseFloat(yB.total) + parseFloat(segmentData[yB.year])).toFixed(2);
                });
              });
            }
          });
          regionLabel.data = _.map(yearObj, 'total');
        });
      } else {
        this.panelRegions[index].forEach(panelRegion => {
          if (panelRegion) {
            const key = _.snakeCase(panelRegion + ' value');
            const regionKeyData = _.find(this.reportFilterData[index], ['key', key]);
            const dataKey = panelRegion.split(' ').join('_');
            let obj = [];
            this.panelYears[index].forEach(y => {
              obj.push({year: y, value: 0});
            });
            if (regionKeyData) {
              this.panelCountries[index].forEach(panelCountry => {
                regionKeyData.value.forEach(rKD => {
                  if (rKD[dataKey] == panelCountry) {
                    obj.forEach(o => {
                      o.value = o.value + parseFloat(rKD[o.year]);
                    });
                  }
                });
              });
            }
            this.barChartData[index].chartData.push({
              label: panelRegion,
              data: _.map(obj, 'value')
            });
          }
        });
      }
      if (this.panelYears[index]) {
        this.barChartData[index].chartLabels = this.panelYears[index].map(String);
      }
    }
  }

  getParentSegmentName(data, value) {
    for (let i = 0; i < data.length; i++) {
      if (_.map(data[i].values, 'segmentName').includes(value)) {
        return data[i].segmentName;
      }
    }
  }

  //Filter Data:
  calculateFilterDataByCountry(index) {
    this.barChartData[index] = [];
    this.buttonSelected[index] = 'Country';
    this.barChartData[index].chartData = [];
    this.barChartData[index].chartLabels = [];
    if (this.panelSegments[index] && this.panelSegments[index].length) {
      let parentSegment = this.getParentSegmentName(this.segmentsData[index], this.panelSegments[index][0]);
      this.panelCountries[index].forEach(panelCountry => {
        this.barChartData[index].chartData.push({
          label: panelCountry,
          data: []
        });
      });
      this.barChartData[index].chartData.forEach(countryLabel => {
        const yearObj = [];
        this.panelYears[index].forEach(y => {
          yearObj.push({
            year: y,
            total: 0
          });
        });
        const outerKey = _.snakeCase(parentSegment + countryLabel.label + ' value');
        const innerKey = _.snakeCase(parentSegment + countryLabel.label);
        const filterData = _.find(this.reportFilterData[index], ['key', outerKey]);
        if (filterData) {
          this.panelSegments[index].forEach(ps => {
            const segmentData = _.find(filterData.value, [innerKey, ps]);
            yearObj.forEach(yB => {
              yB.total = (parseFloat(yB.total) + parseFloat(segmentData[yB.year])).toFixed(2);
            });
          });
        }
        countryLabel.data = _.map(yearObj, 'total');
      });
    } else {
      this.panelCountries[index].forEach(panelCountry => {
        this.panelRegions[index].forEach(panelRegion => {
          const key = _.snakeCase(panelRegion + ' value');
          const regionKeyData = _.find(this.reportFilterData[index], ['key', key]);
          const dataKey = panelRegion.split(' ').join('_');
          let obj = [];
          if (regionKeyData) {
            if (_.map(regionKeyData.value, dataKey).includes(panelCountry)) {
              const countryResult = _.find(regionKeyData.value, [dataKey, panelCountry]);
              this.panelYears[index].forEach(y => {
                obj.push(countryResult[y]);
              });
            }
            if (obj.length) {
              this.barChartData[index].chartData.push({
                label: panelCountry,
                data: obj
              });
            }
          }
        });
      });
    }
    this.barChartData[index].chartLabels = this.panelYears[index].map(String);
  }

  //Driver and Restraints
  selectDrivers(index, types) {
    this.spinner.show();
    this.hidder[index] = this.disRegion[index] = this.disCountry[index] = this.disSegment[index] = true;
    this.disYear[index] = false;
    this.dType = types;
    this.buttonSelected[index] = '';
    if (types === 'Drivers') {
      this.buttonSelected[index] = 'Drivers';
      this.selectedHeading[index] = 'Market Drivers';
    } else if (types === 'Restraints') {
      this.buttonSelected[index] = 'Restraints';
      this.selectedHeading[index] = 'Market Restraints';
    }
    this.reportService.getSectionKeyDetials(this.reportData[index]._id, 'MARKET_DYNAMICS').subscribe(data => {
      d3.select('#driver-container' + index + ' svg').selectAll('svg').remove();
      this.getReportDetailsSuccess(data, types, index);
    }, error => {
      // console.log('error', error);
    });
  }

  selectAllSegmentSelected(event, index) {
    if (event.length) {
      this.panelSegments[index] = _.map(event, 'segmentName');
    } else {
      this.panelSegments[index] = [];
    }
    this.segmentSelected({value: this.panelSegments[index]}, index);
  }


  segmentSelected(event, index) {
    // console.log(event);
    if (event && event.value[0]) {
      this.segmentsData[index].forEach(item => {
        item.isDisable = !_.map(item.values, 'segmentName').includes(event.value[0]);
      });
    } else {
      this.segmentsData[index].forEach(item => {
        item.isDisable = false;
      });
    }
    this.panelSegments[index] = event.value;
  }

  getReportDetailsSuccess(data, type, index) {
    this.spinner.hide();
    this.ratingData[index] = [];
    this.panelYears[index] = [];
    data.map(d => {
      if (d.meta && d.meta.type === type.toUpperCase()) {
        this.ratingData[index].push(d.meta.data);
      }
    });
    if (this.ratingData[index].length > 0) {
      const years = _.map(this.ratingData[index][0].rating, 'year');
      this.years[index] = years;
      this.panelYears[index] = years;
      this.filterDrivers(index);
    }
  }


  driverData(years, demoData, index, type) {
    years.forEach(y => {
      let ob = {
        name: type,
        year: y,
        children: [],
        types: type.toLowerCase()
      };
      demoData.forEach(rd => {
        if (rd.rating.length > 0) {
          const r = _.find(rd.rating, ['year', y]);
          ob.children.push(
            {
              name: rd.name,
              rating: r ? r.rating : ''
            });
        }
      });
      d3.select('#driver-container' + index).selectAll('svg').remove();
      this.finalObject[index].push(ob);
      this.barChartData[index] = {};
      this.barChartData[index].marketDynamics = {type: 'dendrogram', data: this.finalObject[index]};
    });

    if (this.finalObject[index].length) {
      this.generateTrees(index);
    }
  }

  generateTrees(index) {
    this.cnt[index] = 0;
    if (this.cnt[index] == 0) {
      let length = this.finalObject[index].length;
      this.cnt[index] = (this.cnt[index] + 1 + length) % length;
      this.renderTree(this.finalObject[index][this.cnt[index]], index);
      this.showYear[index] = this.finalObject[index][this.cnt[index]].year;
      this.cnt[index]++;
      if (this.cnt[index] > 0) {
        this.interval[index] = d3.interval(() => {
          this.cnt[index] = (this.cnt[index] + 1 + length) % length;
          if (this.finalObject[index].length > 1) {
            d3.select('#driver-container' + index + ' svg').remove();
            this.renderTree(this.finalObject[index][this.cnt[index]], index);
            this.showYear[index] = this.finalObject[index][this.cnt[index]].year;
          }
        }, 1000);
      }
    }
  }

  renderTree(treeData, index) {
    var margin = {top: 5, right: 400, bottom: 10, left: 100},
      width = 800 - margin.right - margin.left,
      height = 260 - margin.top - margin.bottom;

    var svg = d3.select('#driver-container' + index)
      .append('svg')
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var i = 0,
      duration = 750,
      root;


    svg.exit().remove();

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
        .call(wrap, 380);

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
          var o = {x: source.x0, y: source.y0};
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
          var o = {x: source.x, y: source.y};
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

  filterDrivers(index) {
    this.finalObject[index] = [];
    d3.select('#driver-container' + index + ' svg').remove();
    if (this.interval[index]) {
      this.interval[index].stop();
    }
    const demoData = this.ratingData[index];
    const years = this.panelYears[index];
    this.driverData(years, demoData, index, this.dType);
  }

  ngOnDestroy() {
    this.finalObject[0] = [];
    this.ratingData[0] = [];
    if (this.interval[0]) {
      this.interval[0].stop();
    }
    d3.select('#driver-container0 svg').selectAll('svg').remove();
  }

  //Supply chain value chain
  selectSupplyChain(index) {
    this.hidder[index] = true;
    this.disRegion[index] = true;
    this.disCountry[index] = true;
    this.disSegment[index] = true;
    this.disYear[index] = true;
    this.spinner.show();
    this.buttonSelected[index] = 'SupplyChain';
    // this.years[index] = [];
    this.reportService.getSectionKeyDetials(this.reportData[index]._id, 'MARKET_FACTOR_ANALYSIS').subscribe(d => {
      this.getSupplyChainData(d, index);
    }, error => {
    });
  }

  getSupplyChainData(data: any, index) {
    data.forEach(d => {
      if (d.meta_info.section_key === 'supply-chain') {
        this.chainType[index] = _.upperFirst(_.toLower(d.meta.chain_type));
        this.getSupplyChainDataSuccess(d.meta.data, d.content, index);
      }
    });
    this.spinner.hide();
  }

  getSupplyChainDataSuccess(data, nodes, index) {
    this.paths[index] = data;
    this.nodes[index] = nodes;
    this.generateChart(index);
    this.barChartData[index] = {};
    this.barChartData[index].supplyChain = {
      type: 'supply-chain',
      paths: this.paths[index],
      nodes: this.nodes[index]
    };
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
    // this.addPanel();
  }

  generateChart(index) {
    let text = 'graph LR;';
    for (let i = 0; i < this.paths[index].length; i++) {
      text += this.paths[index][i].from.order_id + '[' + this.paths[index][i].from.title + '] -->'
        + this.paths[index][i].to.order_id + '[' + this.paths[index][i].to.title + '];';
    }
    this.chartText[index] = text;
    this.svgCode[index] = '';
    if (!this.chartText[index]) {
      this.chartText[index] = 'graph TD;';
    }
    this.element = document.getElementById('mermaidId' + index);
    const graphDefinition = this.chartText[index];
    mermaid.render('graphDiv' + index, graphDefinition, (svgCode, bindFunctions) => {
      this.element.innerHTML = svgCode;
      this.svgCode[index] = svgCode;
    });
  }

  //porter's 5
  selectPorters(index) {
    this.spinner.show();
    this.hidder[index] = true;
    this.disRegion[index] = true;
    this.disCountry[index] = true;
    this.disSegment[index] = true;
    this.disYear[index] = true;
    const porters = ['Porters 5 forces', 'Threat of New Entrants', 'Bargaining Power of Suppliers', 'Threat of Substitutes', 'Bargaining Power of Buyers', 'Segment Rivalry'];
    this.buttonSelected[index] = '';
    this.portersModules[index] = [];
    this.portersDropDown[index] = [];
    // this.years[index] = [];
    this.buttonSelected[index] = 'Porters';
    porters.forEach(item => {
      this.portersDropDown[index].push(item);
    });
    this.selectedPorters[index] = this.portersDropDown[index][0];
    this.hidder[index] = false;
    this.reportService.getSectionKeyDetials(this.reportData[index]._id, 'MARKET_FACTOR_ANALYSIS').subscribe(d => {
      this.getPortersData(d, index);
    }, error => {
    });
  }

  getPortersData(data: any, index) {
    data.forEach(d => {
      if (d.meta_info.section_key === 'porter') {
        this.getPortersDataSuccess(d.meta.data, index);
      }
    });
    this.spinner.hide();
  }

  getPortersDataSuccess(data, index) {
    data.filter(item => {
      if (item.type == 'Threat of New Entrants') {
        this.threatOfNewEntrantsRating.push(item);
      } else if (item.type == 'Bargaining Power of Suppliers') {
        this.bargainingPowerOfSuppliersRating.push(item);
      } else if (item.type == 'Threat of Substitutes') {
        this.threatOfSubstitutesRating.push(item);
      } else if (item.type == 'Bargaining Power of Buyers') {
        this.bargainingPowerOfBuyersRating.push(item);
      } else if (item.type == 'Segment Rivalry') {
        this.segmentRivalryRating.push(item);
      }
    });
    let threatOfNewEntrantsRatingSum = 0;
    this.threatOfNewEntrantsRating.forEach((e) => {
      threatOfNewEntrantsRatingSum += parseInt(e.rating);
    });
    this.modulesData[0].threatOfNewEntrantsRating = threatOfNewEntrantsRatingSum / this.threatOfNewEntrantsRating.length;

    let bargainingPowerOfSuppliersRatingSum = 0;
    this.bargainingPowerOfSuppliersRating.forEach((e) => {
      bargainingPowerOfSuppliersRatingSum += parseInt(e.rating);
    });
    this.modulesData[0].bargainingPowerOfSuppliersRating = bargainingPowerOfSuppliersRatingSum / this.bargainingPowerOfSuppliersRating.length;

    let bargainingPowerOfBuyersRatingSum = 0;
    this.bargainingPowerOfBuyersRating.forEach((e) => {
      bargainingPowerOfBuyersRatingSum += parseInt(e.rating);
    });
    this.modulesData[0].bargainingPowerOfBuyersRating = bargainingPowerOfBuyersRatingSum / this.bargainingPowerOfBuyersRating.length;


    let threatOfSubstitutesRatingSum = 0;
    this.threatOfSubstitutesRating.forEach((e) => {
      threatOfSubstitutesRatingSum += parseInt(e.rating);
    });
    this.modulesData[0].threatOfSubstitutesRating = threatOfSubstitutesRatingSum / this.threatOfSubstitutesRating.length;


    let segmentRivalryRatingSum = 0;
    this.segmentRivalryRating.forEach((e) => {
      segmentRivalryRatingSum += parseInt(e.rating);
    });
    this.modulesData[0].segmentRivalryRating = segmentRivalryRatingSum / this.segmentRivalryRating.length;

    this.modulesData[0].name = this.reportData[index].title;

    this.portersModules[index] = this.modulesData;
    //porter's id
    document.getElementById('porter' + index).innerHTML = '';
    this.htmlElement = document.getElementById('porter' + index);
    this.chartService.setup(this.htmlElement);
    this.chartService.populate(this.portersModules[index]);

    this.threats[index] = (this.modulesData[0].threatOfNewEntrantsRating >= 4 && this.modulesData[0].threatOfNewEntrantsRating <= 10) ?
      (this.modulesData[0].threatOfNewEntrantsRating >= 4 && this.modulesData[0].threatOfNewEntrantsRating < 8) ? 'medium' : 'high' : 'low';

    this.suppliers[index] = (this.modulesData[0].bargainingPowerOfSuppliersRating >= 4 && this.modulesData[0].bargainingPowerOfSuppliersRating <= 10) ?
      (this.modulesData[0].bargainingPowerOfSuppliersRating >= 4 && this.modulesData[0].bargainingPowerOfSuppliersRating < 8) ? 'medium' : 'high' : 'low';

    this.segments[index] = (this.modulesData[0].segmentRivalryRating >= 4 && this.modulesData[0].segmentRivalryRating <= 10) ?
      (this.modulesData[0].segmentRivalryRating >= 4 && this.modulesData[0].segmentRivalryRating < 8) ? 'medium' : 'high' : 'low';

    this.buyers[index] = (this.modulesData[0].bargainingPowerOfBuyersRating >= 4 && this.modulesData[0].bargainingPowerOfBuyersRating <= 10) ?
      (this.modulesData[0].bargainingPowerOfBuyersRating >= 4 && this.modulesData[0].bargainingPowerOfBuyersRating < 8) ? 'medium' : 'high' : 'low';

    this.substitutes[index] = (this.modulesData[0].threatOfSubstitutesRating >= 4 && this.modulesData[0].threatOfSubstitutesRating <= 10) ?
      (this.modulesData[0].threatOfSubstitutesRating >= 4 && this.modulesData[0].threatOfSubstitutesRating < 8) ? 'medium' : 'high' : 'low';

    this.barChartData[index] = {};
    this.barChartData[index].portersDiagram = {
      type: 'porter-graph',
      data: this.portersModules[index],
      threats: this.threats[index],
      suppliers: this.suppliers[index],
      segments: this.segments[index],
      buyers: this.buyers[index],
      substitutes: this.substitutes[index]
    };
  }

  panelPortersChanged(index, value) {
    if (value === 0) {
      this.selectPorters(index);
    } else {
      this.hidder[index] = true;
      this.portersId[index] = value;
      this.selectedPorters[index] = this.portersDropDown[index][value];
      this.barChartData[index] = {};
      this.barChartData[index].porterDendrogram = {
        type: 'porter-dendogram',
        id: this.portersId[index],
        data: this.selectedPorters[index]
      };
    }
  }

  // Financial overview
  selectFinancialOverview(index) {
    this.hidder[index] = true;
    this.spinner.show();
    this.chartOptions[index] = barChartOptions;
    this.disRegion[index] = true;
    this.disCountry[index] = true;
    this.disSegment[index] = true;
    this.disYear[index] = false;
    this.buttonSelected[index] = 'FinancialOverview';
    this.companyData[index] = this.localStorageService.get('OUTPUT_CP');
    this.companyProfileService.getCompanyAllDetails(this.selectedCompany[index]._id, 'financial_overview,company_name').subscribe(d => {
      if (d) {
        this.generateFinancialData(index, d.financial_overview);
        this.companyData[index] = d;
        this.spinner.hide();
      }
    });
  }

  generateFinancialData(i, d) {
    this.contentFOList[i] = [];
    if (d && d.length) {
      d.forEach(data => {
          if (data.key === 'SBU' && data.content) {
            this.contentFOList[i].push('By SBU');
            this.bySBU[i] = data;
          }
          if (data.key === 'VERTICAL' && data.content) {
            this.contentFOList[i].push('By vertical');
            this.byVertical[i] = data;
          }
          if (data.key === 'REGIONAL' && data.content) {
            this.contentFOList[i].push(('By region'));
            this.byRegion[i] = data;
          }
        }
      );
      this.selectFOData[i] = this.contentFOList[i][0];
      this.onFOElementSelect(i, this.selectFOData[i]);
    }
  }

  onFOElementSelect(i, data) {
    this.selectFOData[i] = data;
    if (this.selectFOData[i] === 'By SBU') {
      this.renderFO(i, this.bySBU[i]);
    } else if (this.selectFOData[i] === 'By vertical') {
      this.renderFO(i, this.byVertical[i]);
    } else if (this.selectFOData[i] === 'By region') {
      this.renderFO(i, this.byRegion[i]);
    }
  }

  renderFO(i, data) {
    this.FoData[i] = [];
    this.FoData[i] = data;
    this.FoYears[i] = [];
    this.FoPanelYears[i] = [];
    this.dataStoreFO[i] = JSON.parse(data.content);
    const temp = this.dataStoreFO[i].data.dataStore;
    const pullYearData = _.pull(_.keys(temp[0]), 'rowHeader', 'content');
    this.FoYears[i] = pullYearData;
    this.FoPanelYears[i] = pullYearData;
    this.filterFO(i);
  }

  filterFO(i) {
    const temp = this.dataStoreFO[i].data.dataStore;
    const finalChartDataFO = [];
    finalChartDataFO[i] = [];
    this.FoPanelYears[i].forEach(item => {
      const obj = {rowHeader: item};
      temp.forEach(t => {
        obj[t.rowHeader] = t[item];
      });
      finalChartDataFO[i].push(obj);
    });
    this.labelXFO[i] = this.FoData[i].name;
    const mainHeader = this.labelXFO[i] + '/years';
    this.colMetaDataFO[i] = [];

    const colsTypeName = _.keys(finalChartDataFO[i][0]);
    this.rowNamesFO[i] = finalChartDataFO[i].map(ele => ele.rowHeader);
    this.colMetaDataFO[i].push({header: mainHeader, name: 'rowHeader', type: 'text'});
    for (let element of colsTypeName) {
      this.colMetaDataFO[i].push({
        name: element,
        header: element,
        type: 'number'
      });
      this.labelYFO[i] = this.FoData[i].currency + '-' + this.FoData[i].metric;
    }
    const colNames = this.colMetaDataFO[i].map(col => col.name);
    const expectedFormat = colNames.filter(col => col != 'rowHeader').map(col => {
      const valList = finalChartDataFO[i].map(ele => ele[col]);
      return {
        label: col,
        data: valList
      };
    });
    this.chartDataFO[i] = [];
    this.chartLabelsFO[i] = [];
    this.chartDataFO[i] = expectedFormat;
    this.chartLabelsFO[i] = this.rowNamesFO[i];
    this.chartOptions[i] = getChartOptions(this.labelXFO[i], this.labelYFO[i]);
    this.chartOptions[i].scales.xAxes[0].stacked = false;
    this.chartOptions[i].scales.yAxes[0].stacked = false;

    this.barChartData[i] = {};
    // this.barChartData[i].chartData = this.chartDataFO[i]
    // this.barChartData[i].chartLabels = this.chartLabelsFO[i]
    this.barChartData[i].FinancialOverview = {
      data: this.chartDataFO[i],
      labels: this.chartLabelsFO[i],
      chartOptions: this.chartOptions[i],
      btnCategory: this.selectFOData[i],
      company: this.selectedCompany[i]
    };
    this.renderBar[i] = true;
  }

  panelFoChanged(index, val) {
    this.barChartData[index] = [];
    this.onFOElementSelect(index, val);
  }

  // Product/service offering
  selectProductOffering(index) {
    this.spinner.show();
    this.hidder[index] = true;
    this.disRegion[index] = true;
    this.disCountry[index] = true;
    this.disSegment[index] = true;
    this.disYear[index] = true;
    this.buttonSelected[index] = 'ProductOffering';
    this.barChartData[index] = [];
    this.companyProfileService.getCompanyAllDetails(this.selectedCompany[index]._id, 'product_offering,company_name').subscribe(d => {
      if (d) {
        this.companyData[index] = d;
        this.poData[index] = d.product_offering;
        this.orgCharts(index);
        this.barChartData[index].productOffering = {
          type: 'productOffering',
          data: this.poData[index],
          company: this.selectedCompany[index]
        };
      }
      this.spinner.hide();
    });
  }

  orgCharts(index) {
    let temporaryThis = this;
    (function ($, JSONLoop) {
      $(function () {
        var datasource = {};
        temporaryThis.poData[index].forEach(function (item, index) {
          if (!item.parentId) {
            delete item.parentId;
            Object.assign(datasource, item);
          } else {
            var jsonloop = new JSONLoop(datasource, 'id', 'children');
            jsonloop.findNodeById(datasource, item.parentId, function (err, node) {
              if (err) {
                // console.error(err);
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
        var rmv = document.getElementById('org-chart-container' + index).innerHTML = '';
        var oc = $('#org-chart-container' + index).orgchart({
          'data': datasource,
          'chartClass': 'edit-state',
          'zoom': true,
          'pan': true,
          'parentNodeSymbol': 'fa-th-large',
        });
      });

    })($, JSONLoop);
  }

  //SWOT
  selectSWOT(index) {
    this.spinner.show();
    this.hidder[index] = true;
    this.disRegion[index] = true;
    this.disCountry[index] = true;
    this.disSegment[index] = true;
    this.disYear[index] = true;
    this.buttonSelected[index] = 'SWOT';
    this.companyData[index] = this.localStorageService.get('OUTPUT_CP');
    this.barChartData[index] = [];
    this.companyProfileService.getSecondaryDetailsByKey(this.selectedCompany[index]._id, ConstantKeys.SWOT_ANALYSIS_SECTION_KEY).subscribe(d => {
      if (d && d.length) {
        this.SWOTData[index] = d;
        this.categorizedSWOTData(this.SWOTData[index], index);
      } else {
        this.strength[index] = [];
        this.weakness[index] = [];
        this.opportunity[index] = [];
        this.threat[index] = [];
      }
    });
  }

  categorizedSWOTData(data, index) {
    data.map(d => {
      if (d.key === 'STRENGTH') {
        this.strength[index] = d.value;
      }
      if (d.key === 'WEAKNESS') {
        this.weakness[index] = d.value;
      }
      if (d.key === 'OPPORTUNITIES') {
        this.opportunity[index] = d.value;
      }
      if (d.key === 'THREAT') {
        this.threat[index] = d.value;
      }
    });
    this.barChartData[index].SWOT = {
      type: 'SWOT',
      strength: this.strength[index],
      weakness: this.weakness[index],
      opportunity: this.opportunity[index],
      threat: this.threat[index],
      company: this.selectedCompany[index],
    };
    this.spinner.hide();
  }

  //download image
  generateImage(index) {
    if (!this.permissions.imageExport) {
      return this.authService.showNotSubscribedMsg();
    }
    let ids = document.getElementById('screen' + index);
    // @ts-ignore
    html2canvas(ids).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'Image.png';
      this.downloadLink.nativeElement.click();
    });
  }

  generateImagePorters(index, data) {
    if (!this.permissions.imageExport) {
      return this.authService.showNotSubscribedMsg();
    }
    let ids = document.getElementById(data + index);
    // @ts-ignore
    html2canvas(ids).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'Image.png';
      this.downloadLink.nativeElement.click();
    });
  }

  //excel download
  downloadBarData(i) {
    let dataLabels;
    let headers;
    let mapLabels;
    let title;
    if (this.buttonSelected[i] === 'FinancialOverview') {
      dataLabels = this.chartLabelsFO[i];
      headers = [`${this.buttonSelected[i]}_${this.selectFOData[i]}`];
      mapLabels = this.chartDataFO[i];
      title = `${this.selectedCompany[i].company_name}_Financial_Overview_${this.selectFOData[i]}`;
    } else {
      dataLabels = this.barChartData[i].chartLabels;
      headers = [this.buttonSelected[i]];
      mapLabels = this.barChartData[i].chartData;
      title = `${this.reportData[i].title}_[${this.reportData[i].me.start_year}-${this.reportData[i].me.end_year}]_by_${this.buttonSelected[i]}`;
    }
    let finalData = [];
    if (dataLabels) {
      dataLabels.forEach(d => {
        headers.push(d);
      });
    }
    let labels = _.map(mapLabels, 'label');
    let data = _.map(mapLabels, 'data');

    labels.forEach((d, i) => {
      let obj = {};
      obj['label'] = d,
        data[i].forEach((dt, j) => {
          obj[`${j}_value`] = dt;
        });
      finalData.push(obj);
    });

    this.excelDownloadService.generateExcelSheet(headers, finalData, title, null);
  }

  openPopup() {
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
  }
}
