import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedInteconnectService } from 'src/app/services/shared-interconnect.service';
import { YoutubeApiService } from 'src/app/services/youtube-api.service';
import { YoutubeDailogComponent } from '../youtube-modal/youtube-modal.component';

@Component({
  selector: 'app-youtube-search',
  templateUrl: './youtube-search.component.html',
  styleUrls: ['./youtube-search.component.scss']
})
export class YoutubeSearchComponent implements OnInit {
  searchText: any;
  articles = [];
  articles2 = [];
  count: any;
  limit: any = 10;
  page = 1;
  iFrameUrl: any;
  pagination: any;
  nextPageToken: any;
  cnt = 0;
  selectIndustrialVertical: any;
  youtubeArray = [];
  selectedAll = true;
  contentList = [
    "https://www.youtube.com/@harvardbusinessreview",
    "https://www.youtube.com/@CNBC",
    "https://www.youtube.com/@markets",
    "https://www.youtube.com/@McKinsey",
    "https://www.youtube.com/@forrester",
    "https://www.youtube.com/@nielsen",
    "https://www.youtube.com/@TheEconomist",
    "https://www.youtube.com/@wef",
    "https://www.youtube.com/@DeloitteUS",
    "https://www.youtube.com/@Gartnervideo",
    "https://www.youtube.com/@NNgroup",
    "https://www.youtube.com/@GrantCardone",
    "https://www.youtube.com/@kpmg",
    "https://www.youtube.com/@PwC",
    "https://www.youtube.com/@IBISWorld1971",
    "https://www.youtube.com/@acumenresearch",
    "https://www.youtube.com/@wsj",
    "https://www.youtube.com/@FrostSullivanGlobal",
    "https://www.youtube.com/@BusinessInsider",
    "https://www.youtube.com/@ZacksInvestmentNews",
    "https://www.youtube.com/@Reuters",
    "https://www.youtube.com/@cbinsights8643",
    "https://www.youtube.com/@datadriveninvestor3818",
    "https://www.youtube.com/@DataDrivenInvestor-ln2sc",
    "https://www.youtube.com/results?search_query=Vox+Business",
    "https://www.youtube.com/@OfficialKantar",
    "https://www.youtube.com/@gallupvideos",
    "https://www.youtube.com/@DunandBrad",
    "https://www.youtube.com/@GoldmanSachs",
    "https://www.youtube.com/@jpmorgan",
    "https://www.youtube.com/@Accenture",
    "https://www.youtube.com/@cfainstitute",
    "https://www.youtube.com/@SPGlobalMarketIntelligence",
    "https://www.youtube.com/@FinancialTimes",
    "https://www.youtube.com/@incmagazine",
    "https://www.youtube.com/@SeekingAlpha",
    "https://www.youtube.com/@nielseniq3851",
    "https://www.youtube.com/@MotleyFool",
    "https://www.youtube.com/@HarvardHBS",
    "https://www.youtube.com/@CNBCi",
    "https://www.youtube.com/@CliftonStrengths",
    "https://www.youtube.com/@McKinsey",
    "https://www.youtube.com/@ernstyoung",
    "https://www.youtube.com/@FitchRatingsVideo",
    "https://www.youtube.com/@BNNBloomberg",
    "https://www.youtube.com/@wharton",
    "https://www.youtube.com/@morningstar",
    "https://www.youtube.com/@bainandcompany",
    "https://www.youtube.com/@IBTimesUK",
    "https://www.youtube.com/@Knowledge@Wharton",
    "https://www.youtube.com/@globaldataplc",
    "https://www.youtube.com/@CNBCtelevision",
    "https://www.youtube.com/@TheStreet",
    "https://www.youtube.com/@CliftonStrengths",
    "https://www.youtube.com/@OxfordbusinessgroupNews",
    "https://www.youtube.com/@markets",
    "https://www.youtube.com/@IBTimesTV",
    "https://www.youtube.com/@jdpowercorporate",
    "https://www.youtube.com/@statistaofficial",
    "https://www.youtube.com/@gallupvideos",
    "https://www.youtube.com/@Ceicdata",
    "https://www.youtube.com/@joneslanglasalle",
    "https://www.youtube.com/@TheConferenceBoard",
    "https://www.youtube.com/@HBRAscend",
    "https://www.youtube.com/@ZebraBI",
    "https://www.youtube.com/@InvestingwithTom",
    "https://www.youtube.com/@MorningBrewDailyShow",
    "https://www.youtube.com/@TheBostonConsultingGroup",
    "https://www.youtube.com/@FastCompany",
    "https://www.youtube.com/@EconomicsExplained",
    "https://www.youtube.com/@GartnerforMarketers",
    "https://www.youtube.com/@ibtmworld",
    "https://www.youtube.com/@BusinessCasual",
    "https://www.youtube.com/@MoodysCorp",
    "https://www.youtube.com/@networldmediagroup5004",
    "https://www.youtube.com/@WorkforceUpperRio",
    "https://www.youtube.com/@FrostSullivanAsiaPacific",
    "https://www.youtube.com/@instinctifpartners9180",
    "https://www.youtube.com/@thefinancialdiet",
    "https://www.youtube.com/@EConsultancyindia",
    "https://www.youtube.com/results?search_query=Silicon+Valley+Business+Journal",
    "https://www.youtube.com/@UKResearchandInnovation",
    "https://www.youtube.com/@wellsfargo",
    "https://www.youtube.com/channel/UCX2DzaAhcLS09XHSmXq3ysg",
    "https://www.youtube.com/@CliftonStrengths",
    "https://www.youtube.com/@wsj",
    "https://www.youtube.com/@DataRobot",
    "https://www.youtube.com/@RealVisionFinance",
    "https://www.youtube.com/@SPIndicesChannel",
    "https://www.youtube.com/@KiplingersPersonalFinance",
    "https://www.youtube.com/@insead",
    "https://www.youtube.com/@NewYorkTimesEvents",
    "https://www.youtube.com/@CorporateKnights",
    "https://www.youtube.com/@nielsen",
    "https://www.youtube.com/@capitaleconomics",
    "https://www.youtube.com/@HBPCorpLearning",
    "https://www.youtube.com/@gallupvideos",
    "https://www.youtube.com/@DBS",
    "https://www.youtube.com/@DunandBradstreet1",
    "https://www.youtube.com/@MarketResearchReports",
    "https://www.youtube.com/@euromonitor",
    "https://www.youtube.com/@investopedia",
    "https://www.youtube.com/@aaporHQvideo",
    "https://www.youtube.com/@TheDrumTV",
    "https://www.youtube.com/@GfKAnNIQcompanyGlobal",
    "https://www.youtube.com/@IBISWorld1971",
    "https://www.youtube.com/@cnbcawaaz",
    "https://www.youtube.com/@UBS",
    "https://www.youtube.com/@dentsuintl",
    "https://www.youtube.com/@CliftonStrengths",
    "https://www.youtube.com/@fmglobal",
    "https://www.youtube.com/@BankofAmerica",
    "https://www.youtube.com/@PwC",
    "https://www.youtube.com/@strategyand",
    "https://www.youtube.com/@adpresearchinstitute1299",
    "https://www.youtube.com/@WION",
    "https://www.youtube.com/@CBSNews",
    "https://www.youtube.com/@PBS",
    "https://www.youtube.com/@YahooFinance",
    "https://www.youtube.com/@thehill",
    "https://www.youtube.com/@StateDept",
    "https://www.youtube.com/@geonews",
    "https://www.youtube.com/@markdweinstein5516",
    "https://www.youtube.com/@Gallup.comNews",
    "https://www.youtube.com/@BusinessInsider",
    "https://www.youtube.com/@Vox",
    "https://www.youtube.com/@D2E",
    "https://www.youtube.com/@FoxBusiness",
    "https://www.youtube.com/@scrippsnews",
    "https://www.youtube.com/@scrippsnews",
    "https://www.youtube.com/@VOANews",
    "https://www.youtube.com/@ArirangCoKrArirangNEWS",
  ]
  results: any;
  isDirectSearch = false;
  selectedText = "";
  categories = [
    "Semiconductor Electronics",
    "Aerospace & Defense",
    "Agriculture",
    "Automobile",
    "Chemicals Materials",
    "Construction",
    "Consumer Retail",
    "Energy Power",
    "Food, Beverages & Nutrition",
    "Healthcare",
    "Industrial Automation Equipment",
    "Information Communications",
  ];

  shuffledArray;
  batchSize = 10;
  batches: string[][] = [];

  constructor(
    private routes: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private youtubeApiService: YoutubeApiService,
    private sharedInteconnectService: SharedInteconnectService,
    public dialog: MatDialog
  ) {
    this.searchText = this.routes.snapshot.queryParams['searchQuery'];
    // console.log("text",this.searchText)
    if (this.routes.snapshot.queryParams['url']) {
      this.openDialog(this.routes.snapshot.queryParams['url']);
    }
  }

  frameURL() {
    return this.sanitizer.bypassSecurityTrustUrl(this.iFrameUrl);
  }

  openIframe(article) {
    if (article.link) {
      this.spinner.show();
      this.iFrameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        article.link
      );
    }
  }

  ngOnInit() {
    if (!this.searchText) {
      this.spinner.show();
      this.selectIndustrialVertical = "All";
      this.searchAll();
    } else {
      this.directSearch();
    }
  }

  directSearch() {
    this.isDirectSearch = true;
    this.searchGoogle();
  }

  searchGoogle() {
    this.spinner.show();
    this.iFrameUrl = "";
    const searchVal = this.searchText
      ? this.searchText
      : this.selectIndustrialVertical;
    this.selectedText = searchVal;

    // console.log(" this.selectedText",this.selectedText);

    this.sharedInteconnectService.nextText(this.selectedText);
    this.youtubeApiService.getAll(searchVal + " industry").subscribe((data) => {
      this.articles = [];
      if (data && data.items) {
        this.page = 1
        data.items.forEach((element) => {
          this.articles.push(element);
        });
        // console.log("this.articles", this.articles);
        this.count = this.articles.length;

        this.nextPageToken = data.nextPageToken;
      }
      this.spinner.hide();
    });
    if (!this.articles.length) {
      this.spinner.hide();
    }
  }

  searchAll() {
    this.selectedText = "All industries";
    this.spinner.show();
    for (let i = 1; i < this.contentList.length; i++) {
      this.youtubeArray.push({
        name: this.contentList[i],
        results: [],
      });
    }
    this.youtubeApiService.getYoutubeResultsForAll().subscribe((data) => {
      if (data && data.data && data.data[0] && data.data[0].videos) {
        const allResults = data.data[0].videos;

        allResults.forEach((element) => {
          this.youtubeArray.forEach((ele) => {
            if (element.name == ele.name) {
              ele.results = element.results;
            }
          });
        });
      }
      this.spinner.hide();
    });
    let batches = this.getRandomItems();
    for (const item of batches) {
      this.youtubeApiService.getAll(item).subscribe((data) => {
        if (data && data.items) {
          data.items.forEach((element) => {
            this.articles2.push(element);
          });
        }
      });
    }
  }

  openDialog(video) {
    const data = {
      url: video,
    };

    const dialogRef = this.dialog.open(YoutubeDailogComponent, {
      width: "650px",
      height: "350px",
      data: data,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  industrialVertical(title) {
    this.isDirectSearch = false;
    this.searchText = null;
    this.selectIndustrialVertical = title;
    this.selectedAll = this.selectIndustrialVertical == "All";
    this.searchGoogle();
  }


  getRandomItems(): string[] {
    const randomItems: string[] = [];
    const shuffledArray = this.contentList.slice().sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < 10; i++) {
      randomItems.push(shuffledArray[i]);
    }
    
    return randomItems;
  }



}
