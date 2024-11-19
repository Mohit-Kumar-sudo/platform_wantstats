import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLayoutRoutingModule } from './user-layout-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from 'src/app/output-components/home/home.component';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule} from '@angular/material/autocomplete'
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TopBarCompanyProfileComponent } from 'src/app/output-components/top-bar-company-profile/top-bar-company-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TopBarChartsComponent } from 'src/app/output-components/top-bar-charts/top-bar-charts.component';
import { MatCardModule } from '@angular/material/card';
import { NgxPaginationModule } from 'ngx-pagination';
import { IndustryReportsComponent } from 'src/app/output-components/industry-reports/industry-reports.component';
import { OutputSearchComponent } from 'src/app/output-components/output-search/output-search.component';
import { YoutubeSearchComponent } from 'src/app/output-components/youtube-search/youtube-search.component';
import { YoutubeDailogComponent } from 'src/app/output-components/youtube-modal/youtube-modal.component';
import { LeadDblistComponent } from 'src/app/output-components/leads/lead-dblist/lead-dblist.component';
import { MatIconModule } from '@angular/material/icon';
import { SecEdgarComponent } from 'src/app/output-components/sec-edgar/sec-edgar.component';
import { ChatContainerComponent } from 'src/app/output-components/chat-container/chat-container.component';
import { OutputChartsAndStatisticsComponent } from 'src/app/output-components/output-charts-and-statistics/output-charts-and-statistics.component';
import { ChartsModule } from 'ng2-charts';
import { CommonChartContainerComponent } from 'src/app/output-components/common-chart-container/common-chart-container.component';
import { ConfirmDialogComponent } from 'src/app/output-components/dashboard/confirm-dialog/confirm-dialog.component';
import { DashboardModalComponent } from 'src/app/output-components/dashboard/dashboard-modal/dashboard-modal.component';
import { DashboardPanelComponent } from 'src/app/output-components/dashboard/dashboard-panel/dashboard-panel.component';
import { DashboardSaveComponent } from 'src/app/output-components/dashboard/dashboard-save/dashboard-save.component';
import { DashboardComponent } from 'src/app/output-components/dashboard/dashboard.component';
import { PortersDropdownComponent } from 'src/app/output-components/dashboard/porters-dropdown/porters-dropdown.component';
import { SelectCheckAllComponent } from 'src/app/output-components/dashboard/select-check-all/select-check-all.component';
import { MatSelectModule } from '@angular/material/select';
import { OutputResultsComponent } from 'src/app/output-components/output-results/output-results.component';
import { PremiumReportsComponent } from 'src/app/output-components/premium-reports/premium-reports.component';
import { PdfViewerComponent } from 'src/app/output-components/pdf-viewer/pdf-viewer.component';
import { UserActivitiesComponent } from 'src/app/components/user/user-activities/user-activities.component';
import { PptListModalComponent } from 'src/app/output-components/ppt/ppt-list-modal/ppt-list-modal.component';
import { StocksComponent } from 'src/app/output-components/stocks/stocks.component';
import { MatTabsModule } from '@angular/material/tabs';
import { HardcodesSuggestionComponent } from 'src/app/shared/hardcodes-suggestion/hardcodes-suggestion.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { TermsConditionsComponent } from 'src/app/output-components/terms-conditions/terms-conditions.component';
import { ContactUsComponent } from 'src/app/output-components/contact-us/contact-us.component';
import { AboutUsComponent } from 'src/app/output-components/about-us/about-us.component';

@NgModule({
  declarations: [
    HomeComponent,
    IndustryReportsComponent,
    TopBarCompanyProfileComponent,
    TopBarChartsComponent,
    OutputSearchComponent,
    YoutubeSearchComponent,
    YoutubeDailogComponent,
    LeadDblistComponent,
    SecEdgarComponent,
    ChatContainerComponent,
    OutputChartsAndStatisticsComponent,
    CommonChartContainerComponent,
    DashboardComponent,
    DashboardModalComponent,
    DashboardPanelComponent,
    DashboardSaveComponent,
    ConfirmDialogComponent,
    PortersDropdownComponent,
    SelectCheckAllComponent,
    OutputResultsComponent,
    PremiumReportsComponent,
    PdfViewerComponent,
    UserActivitiesComponent,
    PptListModalComponent,
    StocksComponent,
    HardcodesSuggestionComponent,
    TermsConditionsComponent,
    ContactUsComponent,
    AboutUsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserLayoutRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatOptionModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatOptionModule,
    NgxSpinnerModule,
    ChartsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      progressBar: true,
    })
  ]
})
export class UserLayoutModule { }
