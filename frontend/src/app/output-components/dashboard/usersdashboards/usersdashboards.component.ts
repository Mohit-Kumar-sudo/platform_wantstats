import {Component, Inject, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {UserService} from '../../../services/user.service';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dashboard-modal',
  templateUrl: './usersdashboards.component.html',
  styleUrls: ['./usersdashboards.component.scss']
})

export class UsersDashboardsComponent implements OnInit {
  dashboards: any;

  constructor(public dialog: MatDialog,
              private userService: UserService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              public dialogRef: MatDialogRef<UsersDashboardsComponent>,
              @Inject(MAT_DIALOG_DATA) public inputData: any) {
  }

  ngOnInit() {
    this.userService.getUserDashboards().subscribe(data => {
      if (data && data.data) {
        this.dashboards = data.data.myDashboards;
        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
    });
  }

  deleteDashboard(id) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinner.show();
        this.userService.deleteUserDashboards(id).subscribe(data => {
          this.dialogRef.close();
          this.spinner.hide();
          this.toastr.success('Dashboard deleted successfully', 'Message');
        }, error => {
          this.spinner.hide();
        });
      }
    });
  }

  doClose() {
    this.dialogRef.close();
  }

}
