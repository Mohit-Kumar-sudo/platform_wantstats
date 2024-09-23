import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyLayoutRoutingModule } from './company-layout-routing.module';
import { ChartResultsComponent } from 'src/app/output-components/chart-results/chart-results.component';
import { SharedOutputProductOfferingComponent } from 'src/app/output-components/shared/shared-output-product-offering/shared-output-product-offering.component';
import { MatCardModule } from '@angular/material/card';
import { ChartsModule } from 'ng2-charts';
import { SharedOutputSwotAnalysisComponent } from 'src/app/output-components/shared/shared-output-swot-analysis/shared-output-swot-analysis.component';
import { SharedSecondaryDataComponent } from 'src/app/output-components/shared/shared-secondary-data/shared-secondary-data.component';
import { MatTableModule } from '@angular/material/table';
import { HardcodeSuggestionComponent } from 'src/app/shared/hardcode-suggestion/hardcode-suggestion.component';
import { MatExpansionModule } from '@angular/material/expansion';


@NgModule({
  declarations: [
    ChartResultsComponent,
    SharedOutputProductOfferingComponent,
    SharedOutputSwotAnalysisComponent,
    SharedSecondaryDataComponent,
    HardcodeSuggestionComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatExpansionModule,
    ChartsModule,
    CompanyLayoutRoutingModule
  ]
})
export class CompanyLayoutModule { }
