import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { BudgetComponent } from './budget/budget.component';
import { AuthGuard } from '../auth-guard.service';
import { BudgetSourceComponent } from './budget-source/budget-source.component';
import { BudgetTypeComponent } from './budget-type/budget-type.component';
import { BudgetSubTypeComponent } from './budget-sub-type/budget-sub-type.component';
import { PlanningNewComponent } from './planning-new/planning-new.component';
import { PlanningComponent } from './planning/planning.component';
import { PlanningEditComponent } from './planning-edit/planning-edit.component';
import { BidTypeComponent } from './bid-type/bid-type.component';

const routes: Routes = [
  {
    path: 'apps', component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'budget', pathMatch: 'full' },
      { path: 'budget', component: BudgetComponent },
      { path: 'budget-source', component: BudgetSourceComponent },
      { path: 'budget-type', component: BudgetTypeComponent },
      { path: 'budget-subtype', component: BudgetSubTypeComponent },
      { path: 'planning', component: PlanningComponent},
      { path: 'planning-new', component: PlanningNewComponent },
      { path: 'planning-edit/:headerId', component: PlanningEditComponent },
      { path: 'bid-type', component: BidTypeComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppsRoutingModule { }
