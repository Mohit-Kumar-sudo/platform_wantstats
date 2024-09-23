import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartResultsComponent } from 'src/app/output-components/chart-results/chart-results.component';

const routes: Routes = [
  {
    path:"chart-results",
    component:ChartResultsComponent
  },
  {
    path:'',
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyLayoutRoutingModule { }
