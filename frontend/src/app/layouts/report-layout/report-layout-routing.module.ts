import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExecutiveSummaryComponent } from 'src/app/output-components/executive-summary/executive-summary.component';
import { DriversComponent } from 'src/app/output-components/market-dynamics/drivers/drivers.component';
import { DroctDriverContainerComponent } from 'src/app/output-components/market-dynamics/droct-driver-container/droct-driver-container.component';
import { MarketEstimationComponent } from 'src/app/output-components/market-estimation/market-estimation/market-estimation.component';
import { MiDefinitionComponent } from 'src/app/output-components/market-introduction/mi-definition/mi-definition.component';
import { MiKeyTakeawaysComponent } from 'src/app/output-components/market-introduction/mi-key-takeaways/mi-key-takeaways.component';
import { MiListOfAssumptionsComponent } from 'src/app/output-components/market-introduction/mi-list-of-assumptions/mi-list-of-assumptions.component';
import { MiMarketInsightsComponent } from 'src/app/output-components/market-introduction/mi-market-insights/mi-market-insights.component';
import { MiMarketStructureComponent } from 'src/app/output-components/market-introduction/mi-market-structure/mi-market-structure.component';
import { MeRegionComponent } from 'src/app/output-components/market-estimation/me-region/me-region.component';
import { MeSegmentsComponent } from 'src/app/output-components/market-estimation/me-segments/me-segments.component';
import { SupplyChainOutputComponent } from 'src/app/output-components/market-factor-analysis/supply-chain-output/supply-chain-output.component';
import { PortersForcesOutputComponent } from 'src/app/output-components/market-factor-analysis/porters-5-forces/porters-forces-output.component';
import { Porters5DiagramComponent } from 'src/app/output-components/market-factor-analysis/porters5-diagram/porters5-diagram.component';
import { MiMarketStudyOfScopeComponent } from 'src/app/output-components/market-introduction/mi-market-study-of-scope/mi-market-study-of-scope.component';
import { CompetitiveOverviewComponent } from 'src/app/output-components/competitive-landscape/competitive-overview/competitive-overview.component';
import { CompetitiveMarketAnalysisOutputComponent } from 'src/app/output-components/competitive-landscape/competitive-market-analysis-output/competitive-market-analysis-output.component';
import { CompetitiveKeyDevelopmentStrategyOutputComponent } from 'src/app/output-components/competitive-landscape/competitive-key-development-strategy-output/competitive-key-development-strategy-output.component';
import { CompetitiveNewDevelopmentOutputComponent } from 'src/app/output-components/competitive-landscape/competitive-new-development-output/competitive-new-development-output.component';
import { CompetitiveMergerAndAcquisitionOutputComponent } from 'src/app/output-components/competitive-landscape/competitive-merger-and-acquisition-output/competitive-merger-and-acquisition-output.component';
import { CompetitiveBenchmarkingOutputComponent } from 'src/app/output-components/competitive-landscape/competitive-benchmarking-output/competitive-benchmarking-output.component';
import { OutputCompaniesComponent } from 'src/app/output-components/output-company-profile/output-companies/output-companies.component';
import { CompetitiveJointVenturesOutputComponent } from 'src/app/output-components/competitive-landscape/competitive-joint-ventures-output/competitive-joint-ventures-output.component';
import { CompetitiveDashboardOutputComponent } from 'src/app/output-components/competitive-landscape/competitive-dashboard-output/competitive-dashboard-output.component';

const routes: Routes = [
  {
    path:'market-estimation',
    component:MarketEstimationComponent
  },
  {
    path:'executive-summary',
    component:ExecutiveSummaryComponent
  },
  {
    path:'definition',
    component:MiDefinitionComponent
  },
  {
    path:'list-of-assumptions',
    component:MiListOfAssumptionsComponent
  },
  {
    path:'market-structure',
    component:MiMarketStructureComponent
  },
  {
    path:'key-takeaways',
    component:MiKeyTakeawaysComponent
  },
  {
    path:'market-insights',
    component:MiMarketInsightsComponent
  },
  {
    path:'me-segments',
    component:MeSegmentsComponent
  },
  {
    path:'me-region',
    component: MeRegionComponent
  },
  {
    path:'driveroutput',
    component:DriversComponent
  },
  {
    path:'droctcontainer',
    component:DroctDriverContainerComponent
  },
  {
    path:'supply-chain-output',
    component:SupplyChainOutputComponent
  },
  {
    path:'porters-forces-output',
    component:PortersForcesOutputComponent
  },
  {
    path:'porter-daigram',
    component:Porters5DiagramComponent
  },
  {
    path:'scope-of-study',
    component:MiMarketStudyOfScopeComponent
  },
  {
    path:'competitive-overview',
    component:CompetitiveOverviewComponent
  },
  {
    path:'market-share-analysis',
    component:CompetitiveMarketAnalysisOutputComponent
  },
  {
    path:'key-development-growth-strategies',
    component:CompetitiveKeyDevelopmentStrategyOutputComponent
  },
  {
    path:'new-product-service-development',
    component:CompetitiveNewDevelopmentOutputComponent
  },
  {
    path:'merger-and-acquisition',
    component:CompetitiveMergerAndAcquisitionOutputComponent
  },
  {
    path:'competitive-benchmarking',
    component:CompetitiveBenchmarkingOutputComponent
  },
  {
    path:'output-company',
    component:OutputCompaniesComponent
  },
  {
    path: "joint-ventures",
    component: CompetitiveJointVenturesOutputComponent,
  },
  {
    path: "competitor-dashboard-output",
    component: CompetitiveDashboardOutputComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportLayoutRoutingModule { }
