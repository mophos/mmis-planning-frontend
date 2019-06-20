import { AccountPayableService } from './../services/account-payable.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppsRoutingModule } from './apps-routing.module';
import { LayoutComponent } from './layout.component';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { AlertService } from '../services/alert.service';
import { AuthModule } from '../auth/auth.module';
import { DirectivesModule } from '../directives/directives.module';
import { PipesModule } from '../pipes/pipes.module';
import { ModalsModule } from '../modals/modals.module';
import { AuthGuard } from '../auth-guard.service';
import { BudgetComponent } from './budget/budget.component';
import { BudgetService } from '../services/budget.service';
import { BudgetSourceComponent } from './budget-source/budget-source.component';
import { BudgetTypeComponent } from './budget-type/budget-type.component';
import { BudgetSubTypeComponent } from './budget-sub-type/budget-sub-type.component';
import { PlanningNewComponent } from './planning-new/planning-new.component';
import { PlanningService } from '../services/planning.service';
import { PlanningComponent } from './planning/planning.component';
import { PlanningEditComponent } from './planning-edit/planning-edit.component';
import { UploadingService } from '../services/uploading.service';
import { BidTypeComponent } from './bid-type/bid-type.component';
import { BidTypeService } from '../services/bid-type.service';
import { AccountPayableComponent } from './account-payable/account-payable.component';
import { AccountPayableNewComponent } from './account-payable-new/account-payable-new.component';
import { AccountPayableNewGroupCostComponent } from './account-payable-new-group-cost/account-payable-new-group-cost.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    AuthModule,
    MyDatePickerTHModule,
    DirectivesModule,
    PipesModule,
    AppsRoutingModule,
    ModalsModule
  ],
  declarations: [
    LayoutComponent,
    BudgetComponent,
    BudgetSourceComponent,
    BudgetTypeComponent,
    BudgetSubTypeComponent,
    PlanningNewComponent,
    PlanningComponent,
    PlanningEditComponent,
    BidTypeComponent,
    AccountPayableComponent,
    AccountPayableNewComponent,
    AccountPayableNewGroupCostComponent
  ],
  providers: [
    AlertService,
    BudgetService,
    PlanningService,
    UploadingService,
    BidTypeService,
    AuthGuard,
    AccountPayableService
  ]
})
export class AppsModule { }
