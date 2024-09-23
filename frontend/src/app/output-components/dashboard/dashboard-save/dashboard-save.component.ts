import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import {UserService} from '../../../services/user.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-dashboard-modal',
  templateUrl: './dashboard-Save.component.html',
  styleUrls: ['./dashboard-Save.component.scss']
})

export class DashboardSaveComponent implements OnInit {
  dashboardTitle: any = '';

  constructor(public dialog: MatDialog,
              private userService: UserService,
              private toastr: ToastrService,
              public dialogRef: MatDialogRef<DashboardSaveComponent>,
              @Inject(MAT_DIALOG_DATA) public inputData: any) {
  }

  ngOnInit() {
  }

  createDashboard() {
    if (this.dashboardTitle) {
      const panels = [];
      this.inputData.forEach(panelItem => {
        panels.push({
          reportId: panelItem.reportData._id,
          data: panelItem.selectedControls
        });
      });
      const apiData = {
        title: this.dashboardTitle,
        panels,
      };
      this.userService.saveUserDashboard(apiData)
        .subscribe(data => {
          this.dialogRef.close();
          this.toastr.success('Dashboard created successfully', 'Message');
        });
    }
  }

  doClose() {
    this.dialogRef.close();
  }

}
