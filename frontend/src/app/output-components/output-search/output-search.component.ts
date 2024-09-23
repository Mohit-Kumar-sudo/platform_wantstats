import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NewsApiService } from 'src/app/services/news-api.service';
import { SharedInteconnectService } from 'src/app/services/shared-interconnect.service';
import { UserService } from 'src/app/services/user.service';

interface News {
  name: string;
  results: SearchResult[];
  image:string;
  count: number;
  config: any;
}

interface SearchResult {
  linkExists: boolean;
  link: string;
  title: string;
  source: string;
  published: Date;
}

@Component({
  selector: 'app-output-search',
  templateUrl: './output-search.component.html',
  styleUrls: ['./output-search.component.scss']
})
export class OutputSearchComponent implements OnInit {

  news: News;
  searchText: any;
  articles: any;
  iFrameUrl: any;
  pagination: any;
   count: any;
   limit: any = 10;
   page = 1;
  contentList = [
    "All",
    "Aerospace and Defense",
    "Automotive",
    "Consumer food and beverages",
    "Chemical and materials",
    "Energy and power",
    "Healthcare",
    "Information and communication technology",
    "Packaging construction and mining",
    "Semiconductor",
  ];
  selectIndustrialVertical: any;
  config: any;
  collection = { count: 0, count1:0, data: [], config: {} };
  googleSearch : News[] = [] ;
  selectedAll = true;
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

  constructor(
    private routes: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private sharedInteconnectService: SharedInteconnectService,
    private newsApiService: NewsApiService,
    private userService: UserService
  ) {
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 10,
    };
    this.searchText = this.routes.snapshot.queryParams['searchQuery'];
  }

  frameURL() {
    return this.sanitizer.bypassSecurityTrustUrl(this.iFrameUrl);
  }

  openIframe(news) {
    if (news && news.link) {
      this.getLink(news);
      this.spinner.show();
      this.iFrameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(news.link);
      this.spinner.hide();
    }
  }

  ngOnInit() {
    if (!this.searchText) {
      this.selectIndustrialVertical = "All";
      this.searchAll();
    } else {
      this.directSearch(0);
    }
  }

  directSearch(page) {
    this.isDirectSearch = true;
    this.searchGoogle(page);
  }

  searchGoogle(page) {
    this.spinner.show();
    this.iFrameUrl = "";

    if (!page) {
      page = 0;
    } else {
      page = page * 10;
    }
    let searchVal;
    if (this.searchText) {
      searchVal = this.searchText;
      this.selectedText = searchVal;
      this.sharedInteconnectService.nextText(this.selectedText);
      this.spinner.hide();
    } else {
      searchVal = this.selectIndustrialVertical + " industry";
      this.selectedText = this.selectIndustrialVertical;
    }

    this.collection.data = [];
    this.newsApiService.getAll(searchVal, page).subscribe((data) => {
      if (data) {
        this.page = 1
        this.collection.count = data.length;
        this.config = {
          itemsPerPage: 10,
          currentPage: 1,
          totalItems: data.length,
        };
        this.collection.config = this.config;

        for (var i = 0; i < this.collection.count; i++) {
          if (searchVal == "Semiconductor Electronics industry" && searchVal) {
            this.collection.data.push({
              images: "../../../assets/newsupdates/semiconductor.png",
              ...data[i],

            });
            this.spinner.hide();
          } else if (searchVal == "Aerospace & Defense industry") {
            this.collection.data.push({
              images: "../../../assets/newsupdates/aerospace.png",
              ...data[i],
            });
          } else if (searchVal == "Agriculture industry") {
            this.collection.data.push({
              images: "../../../assets/newsupdates/agriculture.png",
              ...data[i],
            });
          } else if (searchVal == "Automobile industry") {
            this.collection.data.push({
              images: "../../../assets/newsupdates/automotive.png",
              ...data[i],
            });
          } else if (searchVal == "Chemicals Materials industry") {
            this.collection.data.push({
              images: "../../../assets/newsupdates/chemicals.png",
              ...data[i],
            });
          } else if (searchVal == "Construction industry") {
            this.collection.data.push({
              images:
                "../../../assets/newsupdates/manufacturing-construction.png",
              ...data[i],
            });
          } else if (searchVal == "Consumer Retail industry") {
            this.collection.data.push({
              images:
                "../../../assets/newsupdates/consumer-goods-retail-market.png",
              ...data[i],
            });
          } else if (searchVal == "Energy Power industry") {
            this.collection.data.push({
              images: "../../../assets/newsupdates/energy-power.png",
              ...data[i],
            });
          } else if (searchVal == "Food, Beverages & Nutrition industry") {
            this.collection.data.push({
              images: "../../../assets/newsupdates/food-beverages.png",
              ...data[i],
            });
          } else if (searchVal == "Healthcare industry")  {
            this.collection.data.push({
              images: "../../../assets/newsupdates/healthcare.png",
              ...data[i],
            });
          } else if (searchVal == "Industrial Automation Equipment industry") {
            this.collection.data.push({
              images: "../../../assets/newsupdates/equipment-machinery.png",
              ...data[i],
            });
          } else if (searchVal == "Information Communications industry") {
            this.collection.data.push({
              images: "../../../assets/newsupdates/technology.png",
              ...data[i],
            });
          } else{
            this.collection.data.push({
              images: "https://media4.s-nbcnews.com/i/newscms/2019_01/2705191/nbc-social-default_b6fa4fef0d31ca7e8bc7ff6d117ca9f4.png",
              ... data[i]
            })
          this.spinner.hide();
          }
        }
        this.spinner.hide();
      }

      if (this.routes.snapshot.queryParams['newsLink']) {
        this.openIframe(this.routes.snapshot.queryParams['newsLink']);
      }
    });
  }

  searchAll() {
    this.selectedText = "All industries";
    this.spinner.show();

    for (let i = 1; i < this.contentList.length; i++) {
      let content = {
        name: this.contentList[i],
        results: [],
        count: 0,
        image: '', 
        config: '' 
      };
      this.googleSearch.push(content);
    }

    for (let i = 1; i < this.contentList.length; i++) {
      let searchQuery = this.contentList[i];
      this.newsApiService.getAll(searchQuery, 0).subscribe((data) => {
        if (data) {
          let data1 = {
            data: data,
            name: searchQuery,
            count: data.length,
            images: "",
            config: {
              itemsPerPage: 10,
              currentPage: 1,
              totalItems: data.length,
            },
          };

          this.googleSearch.forEach((ele) => {
            if (ele.name == data1.name) {
              ele.results = data1.data;
              ele.count = ele.results.length;
              ele.config = data1.config;
            }
            if (/semiconductor/i.test(ele.name)) {
              ele.image = "../../../assets/newsupdates/semiconductor.png";
            } else if (/aerospace\s*and\s*defense/i.test(ele.name)) {
              ele.image = "../../../assets/newsupdates/aerospace.png";
            } else if (/agriculture/i.test(ele.name)) {
              ele.image = "../../../assets/newsupdates/agriculture.png";
            } else if (/automotive/i.test(ele.name)) {
              ele.image = "../../../assets/newsupdates/automotive.png";
            } else if (/chemical\s*and\s*materials/i.test(ele.name)) {
              ele.image = "../../../assets/newsupdates/chemicals.png";
            } else if (
              /construction|packaging\s*construction\s*and\s*mining/i.test(
                ele.name
              )
            ) {
              ele.image =
                "../../../assets/newsupdates/manufacturing-construction.png";
            } else if (/consumer\s*food\s*and\s*beverages/i.test(ele.name)) {
              ele.image =
                "../../../assets/newsupdates/consumer-goods-retail-market.png";
            } else if (/energy\s*and\s*power/i.test(ele.name)) {
              ele.image = "../../../assets/newsupdates/energy-power.png";
            } else if (/food\s*beverages\s*&\s*nutrition/i.test(ele.name)) {
              ele.image = "../../../assets/newsupdates/food-beverages.png";
            } else if (/healthcare/i.test(ele.name)) {
              ele.image = "../../../assets/newsupdates/healthcare.png";
            } else if (/industrial\s*automation\s*equipment/i.test(ele.name)) {
              ele.image = "../../../assets/newsupdates/equipment-machinery.png";
            } else if (
              /information\s*and\s*communication\s*technology/i.test(ele.name)
            ) {
              ele.image = "../../../assets/newsupdates/technology.png";
            }
          });
         if (i === this.contentList.length - 1) {
            this.spinner.hide();
          }
        }
      });
    }
  }

  industrialVertical(title) {
    this.isDirectSearch = false;
    this.searchText = null;
    this.selectIndustrialVertical = title;
    if (this.selectIndustrialVertical != "All") {
      this.selectedAll = false;
      this.searchGoogle(0);
    } else {
      this.selectedAll = true;
      this.searchAll();
    }
  }

  getLink(news) {
    if (news && news.title && news.link) {
      this.userService.saveNewsUserHistory(news).subscribe(
        (data) => {
          if (data) {
            // console.log(data);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
}

