import {Component, Inject, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {UserService} from '../../../services/user.service';
import {ToastrService} from 'ngx-toastr';
// import {NgxSpinner} from 'ngx-spinner/lib/ngx-spinner.enum';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
})

export class ConfirmDialogComponent implements OnInit {

  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<ConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public inputData: any) {
  }

  ngOnInit() {
  }

  close(val): void {
    this.dialogRef.close(val);
  }

}
