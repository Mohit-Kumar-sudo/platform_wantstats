import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { PptService } from 'src/app/services/ppt.service';

@Component({
  selector: 'app-profile-links',
  templateUrl: './profile-links.component.html',
  styleUrls: ['./profile-links.component.scss']
})
export class ProfileLinksComponent implements OnInit {

  user: any;

  constructor(private pptService: PptService,
              private spinner: NgxSpinnerService,
              private router : Router,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    // console.log(this.user);
    setTimeout((o:any)=>{                           // <<<---using ()=> syntax
      this.logoutUser()
  }, 21600000);

  }

  openMyPpts() {
    this.router.navigateByUrl('ppt-list')
  }

  logoutUser() {
    this.authService.logout();

  }

  openMyDashboards() {
    this.spinner.show();
    this.pptService.openDashboardsList();
  }


}
