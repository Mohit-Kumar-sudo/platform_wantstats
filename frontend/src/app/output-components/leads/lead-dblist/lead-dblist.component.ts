import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LeadsService } from 'src/app/services/leads.service';

@Component({
  selector: 'app-lead-dblist',
  templateUrl: './lead-dblist.component.html',
  styleUrls: ['./lead-dblist.component.scss']
})
export class LeadDblistComponent implements OnInit {

  companyId: any;
  employessList: any;
  employeeData: any;
  contactSearch: any;
  contactSearch1: any;
  SearchForm!: FormGroup;
  leads: any[] = [];
  searchResults: any[] = [];
  ContactData: any;
  company: any = [];
  FirstName: any;
  LastName: any;
  Email: any;
  designation: any;
  country: any;
  LeadDBPage: boolean;
  LeadsDBList: boolean;
  LeadsDBModel: boolean;
  fullName: any;
  email: any;
  limit: number = 5;
  currentPage: number = 1;
  pagedLeads: any[] = [];
  pages: number[] = [];
  totalPages: number;
  pagesToShow: number = 10;
  scrollToTop: boolean = false;
  totalCount: any;

  trackByContactList(index: number, contactList: any): any {
    return contactList._id; // Use a stable unique identifier
  }

  trackByItem(index: number, item: any): any {
    return item._id; // Use a stable unique identifier
  }

  trackByEmployee(index: number, employee: any): any {
    return employee._id; // Use a stable unique identifier
  }

  constructor(
    private spinner: NgxSpinnerService,
    private leadsApiService: LeadsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.GetAllData();
    this.LeadsDBList = true;
    this.LeadDBPage = false;
  }

  goBack() {
    this.LeadsDBList = true;
    this.LeadDBPage = false;
    this.cdr.detectChanges();
  }

  createAckForm() {
    this.SearchForm = this.formBuilder.group({
      FirstName: [""],
      LastName: [""],
    });
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.limit;
    const endIndex = startIndex + this.limit;
    this.pagedLeads = this.leads
    this.totalPages = Math.ceil(this.totalCount / this.limit);
    const startPage = Math.max(
      1,
      this.currentPage - Math.floor(this.pagesToShow / 2)
    );
    const endPage = Math.min(this.totalPages, startPage + this.pagesToShow - 1);
    this.pages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }

  setCurrentPage(page: number) {
    this.currentPage = page;
    this.GetAllData(this.currentPage, this.limit);
  }

  GetAllData(page: number = 1, limit: number = 5) {
    this.spinner.show(); // Show spinner before making the API call
  
    this.leadsApiService
      .getAllLead(page, limit)
      .then((response: Response) => {
        // Check if there's no content returned (status code 204)
        console.log(response.status);
        if (response.status === 204) {
          this.leads = []; // Handle no content by clearing leads
          this.totalCount = 0;
          this.updatePagination();
          this.spinner.hide();
          
        }
        return response.json(); // Continue to parse JSON if content exists
      })
      .then((res) => {
        // Handle cases where res is undefined (for 204 response)
        if (!res) {
          return;
        }
        // Assuming your response format is { success: true, leads, count }
        this.leads = res.leads || [];
        console.log(res.status);
        this.totalCount = res.count || 0;
        this.updatePagination(); // Update pagination with new data
  
        // Hide spinner after data is fully processed
        this.spinner.hide();
      })
      .catch((error) => {
        // In case of any errors, log the error and hide the spinner
        console.error('Error fetching leads:', error);
        this.spinner.hide();
      });
  }
  

  showLeadDBPage(item: any, id: any, name: any) {
    window.scroll(0,0)
    this.LeadDBPage = true;
    this.LeadsDBList = false;
    this.companyId = id;
    this.employeeData = {
      companyName: name,
      companyId: item._id,
      FirstName: item.first_name,
      LastName: item.last_name,
      Email: item.email,
      designation: item.designation,
      country: item.country,
    };
    this.leads.filter((o) => {
      if (o._id == this.companyId) {
        return (this.employessList = o.leads.slice(0, 10));
      }
    });
    this.employessList = this.employessList.filter((o) => o._id != item._id);
    // console.log("this.employessList",this.employessList)
    this.updatePagination();
  }

  searchDBcontacts(page : number = 1, limit : number = 5) {
    this.currentPage = 1;
    this.LeadsDBList = true;
    this.LeadDBPage = false;
    this.leads = [];
    this.leadsApiService
      .getLeadSearchByName({ company: this.contactSearch, page, limit })
      .then((response) => response.json())
      .then((d) => {
        if (d && d.data) {
          this.searchResults = d.data;
          // console.log("searchResults", this.searchResults)
          this.updatePagination();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  modal: any;

  close() {
    this.LeadsDBModel = false;
    //  this.SearchForm.reset();
  }

  searchByName() {
    this.leads = [];
    const data = {
      first_name: this.FirstName,
      last_name: this.LastName,
      email: this.email,
      full_name: this.fullName,
      designation: this.designation,
      country: this.country,
    };
    this.leadsApiService
      .getLeadSearchByName(data)
      .then((response) => response.json())
      .then((d) => {
        if (d && d.data) {
          // console.log("dataavance",d)
          this.searchResults = d.data;
          // console.log("advancedSearchResults",this.searchResults)
          this.updatePagination();
          // Reset search form values
          this.FirstName = "";
          this.LastName = "";
          this.email = "";
          this.fullName = "";
          this.designation = "";
          this.country = "";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
