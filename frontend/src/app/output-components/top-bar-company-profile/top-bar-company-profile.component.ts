import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConstantKeys } from 'src/app/constants/mfr.constants';
import { companyProfileService } from 'src/app/services/companyprofile.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-top-bar-company-profile',
  templateUrl: './top-bar-company-profile.component.html',
  styleUrls: ['./top-bar-company-profile.component.scss']
})
export class TopBarCompanyProfileComponent implements OnInit {

  searchText: any;
  allCompanies: any = [];
  currentReport: any;

  TopCompines = [
    { _id: '5f0b1d3566c7a23190e85587', company_name: "Mondelez International Inc."},
    { _id: '5efc71cd43a46c345a6d5c8c', company_name:  "Unilever PLC"},
    { _id: '63dcb13a84b5ef39849e40e5', company_name: "Mars Incorporated"},
    { _id: '5ea05ae59736bf00044c5ade', company_name:  "CONAGRA BRANDS, INC."},
    { _id: '63dccb1084b5ef39849e4131', company_name: "The Hershey Company"},
    { _id: '5efd9c9e430d8c3fe4d56143', company_name: "Kellogg Company"},
    { _id: '5e28af6fb803e000046d8875', company_name: "THE KRAFT HEINZ COMPANY"},
    { _id: '5e25f58af2ae060004123231', company_name:   "THE COCA-COLA COMPANY"},
    { _id: '5e25ef15f2ae06000412322c', company_name:  "PEPSICO, INC"},
    { _id: '5e25f66df2ae060004123235', company_name:  "NESTLÉ S.A."},
    { _id: '6450ec2dedc5120c0f7c0c85', company_name:  "Wangkanai Sugar Co. Ltd."},
    { _id: '644a68e74d2d906235213ba0', company_name:  "Tereos" },
    { _id: '5ee0d932de208662745c4046', company_name:  "Pronatec AG"},
    { _id: '5ee0f28ede208662745c412b', company_name:  "Nordzucker AG" },
    { _id: '5ee0fb0ade208662745c4166', company_name:  "LOC Industries, Inc."},
    { _id: '6450d694edc5120c0f7c0c40', company_name:  "La Felsina" },
    { _id: '5ee0da54de208662745c4059', company_name:  "Jalles Machado S / A"},
    { _id: '5ee0d6dbde208662745c4030', company_name:  "Südzucker AG" },
    { _id: '5ee0dc9cde208662745c406c', company_name:  "Cosan Ltd."},
    { _id: '5e9d6f87cf60d40004b9ffa4', company_name:  "BUNGE LIMITED" },
  ]
  showNoChartsMessage: boolean = false;
  loadingIndicator: boolean;

  constructor(
    private companyProfileService: companyProfileService ,
    private localStorageService: LocalStorageService,
    private spinner : NgxSpinnerService
  ) {

  }

  ngOnInit() {
    this.currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT)
    // this.getAllCompaniesData();
    setTimeout(() => {
      this.showNoChartsMessage = true;
    }, 2000);
    this.companyProfileService.loadingIndicator$.subscribe(loading => {
      this.loadingIndicator = loading;
    });
  }

  getAllCompaniesData(){
    this.spinner.show()
    this.companyProfileService.getAllCompanies().subscribe((res:any) => {
      if(res && res){
        this.allCompanies = res;
        // console.log("this.allCompanies",this.allCompanies);

        this.spinner.hide()
      }
    })
  }

  searchCp(value) {
    this.searchText = value
    if (this.searchText.trim()) {
      this.companyProfileService.getCompaniesByString(this.searchText).subscribe(data => {
        this.allCompanies = [];
        if (data && data) {
          this.allCompanies = data.data;
          this.showNoChartsMessage = this.allCompanies.length === 0;
        }
      });
    }
  }
}
