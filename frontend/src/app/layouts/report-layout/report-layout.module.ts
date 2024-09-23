import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportLayoutRoutingModule } from './report-layout-routing.module';
import { MarketEstimationComponent } from 'src/app/output-components/market-estimation/market-estimation/market-estimation.component';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ExecutiveSummaryComponent } from 'src/app/output-components/executive-summary/executive-summary.component';
import { SecondaryOutputComponent } from 'src/app/output-components/secondary-output/secondary-output.component';
import { ChartsModule } from 'ng2-charts';
import { MatTableModule } from '@angular/material/table';
import { MiDefinitionComponent } from 'src/app/output-components/market-introduction/mi-definition/mi-definition.component';
import { MiKeyTakeawaysComponent } from 'src/app/output-components/market-introduction/mi-key-takeaways/mi-key-takeaways.component';
import { MiListOfAssumptionsComponent } from 'src/app/output-components/market-introduction/mi-list-of-assumptions/mi-list-of-assumptions.component';
import { MiMacroFactorIndicatorsAnalysisComponent } from 'src/app/output-components/market-introduction/mi-macro-factor-indicators-analysis/mi-macro-factor-indicators-analysis.component';
import { MiMarketInsightsComponent } from 'src/app/output-components/market-introduction/mi-market-insights/mi-market-insights.component';
import { MiMarketStructureComponent } from 'src/app/output-components/market-introduction/mi-market-structure/mi-market-structure.component';
import { MiMarketStudyOfScopeComponent } from 'src/app/output-components/market-introduction/mi-market-study-of-scope/mi-market-study-of-scope.component';
import { HardcodedSuggestionsComponent } from 'src/app/output-components/hardcoded-suggestions/hardcoded-suggestions.component';
import { DroctDriverContainerComponent } from 'src/app/output-components/market-dynamics/droct-driver-container/droct-driver-container.component';
import { MeDialogComponent } from 'src/app/output-components/market-estimation/me-dialog/me-dialog.component';
import { SupplyChainOutputComponent } from 'src/app/output-components/market-factor-analysis/supply-chain-output/supply-chain-output.component';
import { MeSegmentsComponent } from 'src/app/output-components/market-estimation/me-segments/me-segments.component';
import { MeRegionComponent } from 'src/app/output-components/market-estimation/me-region/me-region.component';
import { ChangeTableCAGRYearPipe } from 'src/app/pipes/changeTableCAGRYear.pipe';
import { GiveSegmentNamePipe } from 'src/app/pipes/giveSegmentName.pipe';
import { RemoveParentPipe } from 'src/app/pipes/removeParent.pipe';
import { ReplaceUnderscoreWithSpacePipe } from 'src/app/pipes/replaceUnderscoreWithSpace.pipe';
import { DriversComponent } from 'src/app/output-components/market-dynamics/drivers/drivers.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { PortersForcesOutputComponent } from 'src/app/output-components/market-factor-analysis/porters-5-forces/porters-forces-output.component';
import { PorterDriverComponent } from 'src/app/output-components/charts/porter-driver/porter-driver.component';
import { PortersOutputDialogComponent } from 'src/app/output-components/market-factor-analysis/porters-output-dialog/porters-output-dialog.component';
import { Porters5DiagramComponent } from 'src/app/output-components/market-factor-analysis/porters5-diagram/porters5-diagram.component';
import { SupplyChainOutputDialogComponent } from 'src/app/output-components/market-factor-analysis/supply-chain-output-dialog/supply-chain-output-dialog.component';
import { PortersRadarOutputDialogComponent } from 'src/app/output-components/market-factor-analysis/porters-radar-output-dialog/porters-radar-output-dialog.component';
import { CompetitiveOverviewComponent } from 'src/app/output-components/competitive-landscape/competitive-overview/competitive-overview.component';
import { CompetitiveSecondaryOutputComponent } from 'src/app/output-components/competitive-landscape/competitive-secondary-output/competitive-secondary-output.component';
import { CompetitiveMarketAnalysisOutputComponent } from 'src/app/output-components/competitive-landscape/competitive-market-analysis-output/competitive-market-analysis-output.component';
import { CompetitiveKeyDevelopmentStrategyOutputComponent } from 'src/app/output-components/competitive-landscape/competitive-key-development-strategy-output/competitive-key-development-strategy-output.component';
import { CompetitiveNewDevelopmentOutputComponent } from 'src/app/output-components/competitive-landscape/competitive-new-development-output/competitive-new-development-output.component';
import { CompetitiveMergerAndAcquisitionOutputComponent } from 'src/app/output-components/competitive-landscape/competitive-merger-and-acquisition-output/competitive-merger-and-acquisition-output.component';
import { CompetitiveBenchmarkingOutputComponent } from 'src/app/output-components/competitive-landscape/competitive-benchmarking-output/competitive-benchmarking-output.component';
import { MarketEstimationDialogComponent } from 'src/app/output-components/market-estimation/market-estimation-dialog/market-estimation-dialog.component';
import { OutputCompaniesComponent } from 'src/app/output-components/output-company-profile/output-companies/output-companies.component';
import { OutputProductOfferingDialogComponent } from 'src/app/output-components/output-company-profile/output-product-offering-dialog/output-product-offering-dialog.component';
import { OutputProductOfferingComponent } from 'src/app/output-components/output-company-profile/output-product-offering/output-product-offering.component';
import { OutputSwotAnalysisComponent } from 'src/app/output-components/output-company-profile/output-swot-analysis/output-swot-analysis.component';
import { OutputSwotDialogComponent } from 'src/app/output-components/output-company-profile/output-swot-dialog/output-swot-dialog.component';
import { OutputCompanyBarDialogComponent } from 'src/app/output-components/output-company-profile/output-company-bar-dialog/output-company-bar-dialog.component';
import { OutputCompanySharedComponent } from 'src/app/output-components/output-company-profile/output-company-shared/output-company-shared.component';
import { OutputFinancialOverviewComponent } from 'src/app/output-components/output-company-profile/output-financial-overview/output-financial-overview.component';
import { DriversOutputDialogComponent } from 'src/app/output-components/market-dynamics/drivers-output-dialog/drivers-output-dialog.component';
import { CompetitiveJointVenturesOutputComponent } from 'src/app/output-components/competitive-landscape/competitive-joint-ventures-output/competitive-joint-ventures-output.component';
import { CompetitiveDashboardOutputComponent } from 'src/app/output-components/competitive-landscape/competitive-dashboard-output/competitive-dashboard-output.component';
import { CompetitiveDashboardDialogComponent } from 'src/app/output-components/competitive-landscape/competitive-dashboard-dialog/competitive-dashboard-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { StartOnlyWithAlphabetsPipe } from 'src/app/pipes/startOnlyWithAlphabets.pipe';
import { ValueFromKeyPipe } from 'src/app/pipes/valueFromKey.pipe';

@NgModule({
  declarations: [
    MarketEstimationComponent,
    ExecutiveSummaryComponent,
    SecondaryOutputComponent,
    MiDefinitionComponent,
    MiKeyTakeawaysComponent,
    MiListOfAssumptionsComponent,
    MiMacroFactorIndicatorsAnalysisComponent,
    MiMarketInsightsComponent,
    MiMarketStructureComponent,
    MiMarketStudyOfScopeComponent,
    DroctDriverContainerComponent,
    MeDialogComponent,
    SupplyChainOutputComponent,
    MeSegmentsComponent,
    GiveSegmentNamePipe,
    ChangeTableCAGRYearPipe,
    MeRegionComponent,
    RemoveParentPipe,
    ReplaceUnderscoreWithSpacePipe,
    HardcodedSuggestionsComponent,
    DriversComponent,
    PorterDriverComponent,
    PortersForcesOutputComponent,
    PortersOutputDialogComponent,
    Porters5DiagramComponent,
    SupplyChainOutputDialogComponent,
    PortersRadarOutputDialogComponent,
    CompetitiveOverviewComponent,
    CompetitiveSecondaryOutputComponent,
    CompetitiveMarketAnalysisOutputComponent,
    CompetitiveKeyDevelopmentStrategyOutputComponent,
    CompetitiveNewDevelopmentOutputComponent,
    CompetitiveMergerAndAcquisitionOutputComponent,
    CompetitiveBenchmarkingOutputComponent,
    MarketEstimationDialogComponent,
    OutputCompaniesComponent,
    OutputCompanySharedComponent,
    OutputFinancialOverviewComponent,
    OutputCompanyBarDialogComponent,
    OutputProductOfferingComponent,
    OutputProductOfferingDialogComponent,
    OutputSwotDialogComponent,
    OutputSwotAnalysisComponent,
    DriversOutputDialogComponent,
    CompetitiveJointVenturesOutputComponent,
    CompetitiveDashboardOutputComponent,
    CompetitiveDashboardDialogComponent,
    StartOnlyWithAlphabetsPipe,
    ValueFromKeyPipe
  ],
  imports: [
    CommonModule,
    ReportLayoutRoutingModule,
    MatCardModule,
    ChartsModule,
    HttpClientModule,
    MatInputModule,
    MatTableModule,
    MatSnackBarModule,
    NgxSpinnerModule,
    MatToolbarModule,
    MatExpansionModule,
    MatIconModule
  ],
  exports:[
    SecondaryOutputComponent,
    HardcodedSuggestionsComponent,
  ]
})
export class ReportLayoutModule { }
