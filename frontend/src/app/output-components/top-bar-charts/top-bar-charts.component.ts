import { OnInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { debounce } from 'lodash';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConstantKeys } from 'src/app/constants/mfr.constants';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { OutputResultsService } from 'src/app/services/output-result.service';
import { SharedInteconnectService } from 'src/app/services/shared-interconnect.service';
import { MatPaginator } from '@angular/material/paginator';
import { HistoryService } from 'src/app/services/history.service';
import { ToastrService } from 'ngx-toastr';

interface Chart {
  title: string;
  key: string;
}

@Component({
  selector: 'app-top-bar-charts',
  templateUrl: './top-bar-charts.component.html',
  styleUrls: ['./top-bar-charts.component.scss'],
})
export class TopBarChartsComponent implements OnInit {
  searchText: any = '';
  finalData: any;
  searchSubscription: Subscription;
  chartsData: any;
  currentReport: any;
  displayedColumns: string[] = ['Title']; //, 'ToLocation' FromSub
  dataSource: any;
  searchTerm : FormControl = new FormControl();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  interConnectData = {
    section: '',
    data: [],
  };
  reportConnectData = {
    section: '',
    data: [],
  };
  overlaps: any;
  chartsList: Chart[] = [];
  searchResults: any;
  meChartsData: any[] = [];
  filterResults: any = [];
  count: any;
  limit: any = 10;
  page = 1;
  p: number = 1;
  inputValue: any = "";

  categories = [
    { id: 1, value: 'Aerospace And Defense', isChecked: false },
    { id: 2, value: 'Agriculture', isChecked: false },
    { id: 3, value: 'Automobile', isChecked: false },
    { id: 4, value: 'Chemicals & Materials', isChecked: false },
    { id: 5, value: 'Construction', isChecked: false },
    { id: 6, value: 'Energy & Power', isChecked: false },
    { id: 7, value: 'Food, Beverages & Nutrition', isChecked: false },
    { id: 8, value: 'Healthcare', isChecked: false },
    { id: 9, value: 'Industrial Automation & Equipment', isChecked: false },
    { id: 10, value: 'Information & Communications', isChecked: false },
    { id: 11, value: 'Packaging & Transport', isChecked: false },
    { id: 12, value: 'Semiconductor & Electronics', isChecked: false },
  ];
  showNoChartsMessage: boolean;
  searchString: any;
  loadingIndicator:Boolean;
  focusList: any = {
    charts:[]
  };

  constructor(
    private outputResultsService: OutputResultsService,
    private localStorageService: LocalStorageService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sharedInteconnectService: SharedInteconnectService,
    private historyService : HistoryService,
    private toaster : ToastrService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.showNoChartsMessage = true;
    }, 1000);
    this.currentReport = this.localStorageService.get(
      ConstantKeys.CURRENT_REPORT
    );
    console.log("this.currentReport",this.currentReport)
    this.searchText = this.activatedRoute.snapshot.queryParams['searchText'];
    if (this.searchText) {
      this.searchCharts(this.searchText);
    } else {
      this.searchCharts(['Iot', 'Healthcare', 'dermal filler']);
    }
    this.outputResultsService.loadingIndicator$.subscribe(loading => {
      this.loadingIndicator = loading;
    });
    this.getCharts()
  }

  onInputChange = debounce((event: any) => {
    this.inputValue = event.target.value.trim();
    this.searchText = this.inputValue;
    this.searchCharts(this.inputValue);
  }, 2000);

  SelectedValue(item) {
    this.categories.forEach((val) => {
      if (val.id == item.id) {
        val.isChecked = !val.isChecked;
      } else {
        val.isChecked = false;
      }
    });

    this.searchText = item.value;
    this.searchString = this.searchText.toLowerCase();
    this.searchCharts(this.searchString);
  }

  searchCharts(searchStrings: string | string[]): void {
    if (!Array.isArray(searchStrings)) {
      searchStrings = [searchStrings];
    }
    const adjustedSearchStrings = searchStrings.map((searchString) => {
      {
        switch (searchString.toLowerCase()) {
          case 'aerospace and defense':
            return 'Aerospace And Defense';
          case 'agriculture':
            return 'Agricultural';
          case 'automobile':
            return 'Automotive';
          case 'chemicals & materials':
            return 'Chemicals';
          case 'construction':
            return 'Construction';
          case 'energy & power':
            return 'Energy';
          case 'food, beverages & nutrition':
            return 'Beverages';
          case 'healthcare':
            return 'Global Healthcare';
          case 'industrial automation & equipment':
            return 'Industrial Automation';
          case 'information & communications':
            return 'communication';
          case 'packaging & transport':
            return 'Packaging';
          case 'semiconductor & electronics':
            return 'Semiconductor';
          default:
            return searchString;
        }
      }
    });

    this.spinner.show();

    if (this.searchText) {
      this.router.navigate(['top-bar-charts'], {
        queryParams: { searchText: adjustedSearchStrings.join(',') },
      });
    }

    this.sharedInteconnectService.nextText(adjustedSearchStrings.join(','));

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    this.searchSubscription = this.outputResultsService
      .searchTablesChartsImagesByStr('chart', adjustedSearchStrings)
      .subscribe((data) => {
        this.page = 1;
        // Check if data and meChartsData are defined and not empty
        if (data.meChartsData) {
          // Hide spinner
          this.spinner.hide();
          // Reset chartsList
          this.chartsList = [];
          this.meChartsData = data.meChartsData
          // Iterate through the received data
          this.meChartsData.forEach((item) => {
            item.titles.forEach((title) => {
              if (
                adjustedSearchStrings.some(searchString =>
                  title.title.toLowerCase().includes(searchString.toLowerCase())
                )
              ) {
                title.reportId = item._id;
                this.chartsList.push(title);
              }
            });
          });
        } else {
          // Hide spinner when no data is received
          this.spinner.hide();
        }
      });
  }

  navigateToChartsAndStatistics(chart) {
    this.spinner.show();
    this.localStorageService.set(
      ConstantKeys.CURRENT_OUTPUT_CHART_AND_STATISTICS_DATA,
      chart
    );
    this.localStorageService.set(
      ConstantKeys.CURRENT_OP_CHART_AND_STASTISTICS_LIST,
      this.meChartsData
    );
    this.router.navigateByUrl('output-charts-and-statistics');
  }

  getCharts(){
    this.historyService.getReportsList().subscribe((res:any) => {
      if(res.data){
        this.focusList =res.data[0].charts.map((id: any) => {
          return id._id;
        });
        console.log('charts', this.focusList)
      } else {
        console.log('unable to fetch charts focus list')
      }
    })
  }

  addChartToActivity(chartId){
    this.focusList.charts.push(chartId)
    this.historyService.addCharts(this.focusList.charts).subscribe((res:any) => {
      if(res.data){
        this.toaster.success('Chart Added to My Focus Area')
      } else {
        this.toaster.warning('Something went wrong Please try again')
      }
    })
  }

}


