import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserActivitiesComponent } from 'src/app/components/user/user-activities/user-activities.component';
import { CategorywiseReportComponent } from 'src/app/output-components/categorywise-report/categorywise-report.component';
import { ChatContainerComponent } from 'src/app/output-components/chat-container/chat-container.component';
import { DashboardComponent } from 'src/app/output-components/dashboard/dashboard.component';
import { HomeComponent } from 'src/app/output-components/home/home.component';
import { IndustryReportsComponent } from 'src/app/output-components/industry-reports/industry-reports.component';
import { LeadDblistComponent } from 'src/app/output-components/leads/lead-dblist/lead-dblist.component';
import { OutputChartsAndStatisticsComponent } from 'src/app/output-components/output-charts-and-statistics/output-charts-and-statistics.component';
import { OutputResultsComponent } from 'src/app/output-components/output-results/output-results.component';
import { OutputSearchComponent } from 'src/app/output-components/output-search/output-search.component';
import { PdfViewerComponent } from 'src/app/output-components/pdf-viewer/pdf-viewer.component';
import { PptListModalComponent } from 'src/app/output-components/ppt/ppt-list-modal/ppt-list-modal.component';
import { PremiumReportsComponent } from 'src/app/output-components/premium-reports/premium-reports.component';
import { SecEdgarComponent } from 'src/app/output-components/sec-edgar/sec-edgar.component';
import { StocksComponent } from 'src/app/output-components/stocks/stocks.component';
import { TopBarChartsComponent } from 'src/app/output-components/top-bar-charts/top-bar-charts.component';
import { TopBarCompanyProfileComponent } from 'src/app/output-components/top-bar-company-profile/top-bar-company-profile.component';
import { YoutubeSearchComponent } from 'src/app/output-components/youtube-search/youtube-search.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path:'top-bar-cp',
    component:TopBarCompanyProfileComponent
  },
  {
    path:'top-bar-charts',
    component:TopBarChartsComponent
  },
  {
    path:'output-chart',
    component:ChatContainerComponent,
    children:[
      {
        path:'api-search',
        component:OutputSearchComponent
      },
      {
        path:'youtube',
        component:YoutubeSearchComponent
      },
      {
        path:'sec-edgar',
        component:SecEdgarComponent
      }
    ]
  },
  {
    path:'industry-reports',
    component:IndustryReportsComponent
  },
  {
    path:'LeadDb-List',
    component:LeadDblistComponent
  },
  {
    path:'output-charts-and-statistics',
    component:OutputChartsAndStatisticsComponent
  },
  {
    path:'dashboard',
    component:DashboardComponent
  },
  {
    path:'Categorywise-reports',
    component:CategorywiseReportComponent
  },
  {
    path:'search-results',
    component:OutputResultsComponent
  },
  {
    path:'premium-reports/:id',
    component:PremiumReportsComponent
  },
  {
    path:'view-pdf/:reportId',
    component:PdfViewerComponent
  },
  {
    path:'user-activities',
    component:UserActivitiesComponent,

  },
  {
    path:'ppt-list',
    component:PptListModalComponent
  },
  {
    path:'stocks',
    component:StocksComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserLayoutRoutingModule {}
