import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import {
    MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
    MatToolbarModule, MatMenuModule, MatIconModule, MatProgressSpinnerModule, MatGridListModule, MatDatepickerModule,
    MatSelectModule, MatRadioModule, MatSidenavModule, MatStepperModule, MatSnackBarModule, MatPaginatorModule, MatBadgeModule
} from '@angular/material';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';


@NgModule({
    imports: [
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatDialogModule,
        MatTableModule,
        MatMenuModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatGridListModule,
        MatDatepickerModule,
        MatListModule,
        MatTabsModule,
        MatSelectModule,
        MatRadioModule,
        MatSidenavModule,
        MatDividerModule,
        MatExpansionModule,
        MatPaginatorModule,
        MatBadgeModule
    ],
    exports: [
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatDialogModule,
        MatTableModule,
        MatMenuModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatGridListModule,
        MatDatepickerModule,
        MatListModule,
        MatTabsModule,
        MatSelectModule,
        MatRadioModule,
        MatSidenavModule,
        MatDividerModule,
        MatStepperModule,
        MatExpansionModule,
        MatSnackBarModule,
        MatPaginatorModule,
        MatBadgeModule
    ],
})
export class CustomMaterialModule { }
