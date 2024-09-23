import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { ToastrModule } from 'ngx-toastr';
import { CategorywiseReportComponent } from './output-components/categorywise-report/categorywise-report.component';
import { CompetitiveLandscapeComponent } from './output-components/competitive-landscape/competitive-landscape.component';
import { CovidImpactComponent } from './output-components/covid-impact/covid-impact.component';
import { GoogleFinanceNewsComponent } from './output-components/google-finance-news/google-finance-news.component';
import { InterconnectsInputComponent } from './output-components/interconnects-input/interconnects-input.component';
import { LeadDbPageComponent } from './output-components/leads/lead-db-page/lead-db-page.component';
import { LeadsDataComponent } from './output-components/leads/leads-data/leads-data.component';
import { LeadsDbComponent } from './output-components/leads/leads-db/leads-db.component';
import { MyArchivePageComponent } from './output-components/leads/my-archive-page/my-archive-page.component';
import { UsersDashboardsComponent } from './output-components/dashboard/usersdashboards/usersdashboards.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ListInputComponent } from './components/core/list-input/list-input.component';
import { BarChartComponent } from './output-components/charts/bar-chart/bar-chart.component';
import { DendogramComponent } from './output-components/charts/dendogram/dendogram.component';
import { DriverComponent } from './output-components/charts/driver/driver.component';
import { PieChartComponent } from './output-components/charts/pie-chart/pie-chart.component';
import { RadarChartComponent } from './output-components/charts/radar-chart/radar-chart.component';
import { SupplyChainComponent } from './output-components/charts/supply-chain/supply-chain.component';
import { SwotAnalysisComponent } from './output-components/charts/swot-analysis/swot-analysis.component';
import { RadarChartService } from './services/radar-chart.service';
import { SharedAnalyticsService } from './services/shared-analytics.service';
import { MatInputModule } from '@angular/material/input';
import { ReportLayoutComponent } from './layouts/report-layout/report-layout.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CompanyLayoutComponent } from './layouts/company-layout/company-layout.component';
import { ChatBotComponent } from './output-components/chat-bot/chat-bot.component';
@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    ReportLayoutComponent,
    UserLayoutComponent,
    CompanyLayoutComponent,
    CategorywiseReportComponent,
    CompetitiveLandscapeComponent,
    CovidImpactComponent,
    GoogleFinanceNewsComponent,
    InterconnectsInputComponent,
    LeadDbPageComponent,
    LeadsDataComponent,
    LeadsDbComponent,
    MyArchivePageComponent,
    UsersDashboardsComponent,
    ListInputComponent,
    BarChartComponent,
    DendogramComponent,
    DriverComponent,
    PieChartComponent,
    RadarChartComponent,
    SupplyChainComponent,
    SwotAnalysisComponent,
    UsersDashboardsComponent,
    ChatBotComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatSidenavModule,
    MatDialogModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    MatCardModule,
    MatInputModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({  
      preventDuplicates: true,
      progressBar: true,
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    RadarChartService,
    SharedAnalyticsService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
