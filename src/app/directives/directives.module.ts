import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
import { AgxTypeaheadModule } from '@siteslave/agx-typeahead';
import { StandardService } from '../services/standard.service';
import { SelectUnitComponent } from './select-unit/select-unit.component';
import { NumberWithoutDotDirective } from './number-without-dot.directive';
import { NumberOnlyDirective } from './number-only.directive';
import { SelectBidtypeComponent } from './select-bidtype/select-bidtype.component';
import { HtmlPreviewComponent } from './html-preview/html-preview.component';
import { SearchGenericComponent } from './search-generic/search-generic.component';
import { DatagridPlanningComponent } from './datagrid-planning/datagrid-planning.component';
import { PipesModule } from '../pipes/pipes.module';
import { ModalsModule } from '../modals/modals.module';
import { SelectGenericTypeComponent } from './select-generic-type/select-generic-type.component';
import { NumberNegativeDirective } from './number-negative.directive';
import { DatagridPayableComponent } from './datagrid-payable/datagrid-payable.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    AgxTypeaheadModule,
    PipesModule,
    ModalsModule
  ],
  declarations: [
    SelectUnitComponent,
    NumberWithoutDotDirective,
    NumberOnlyDirective,
    SelectBidtypeComponent,
    HtmlPreviewComponent,
    SearchGenericComponent,
    DatagridPlanningComponent,
    SelectGenericTypeComponent,
    NumberNegativeDirective,
    DatagridPayableComponent
  ],
  exports: [
    SelectUnitComponent,
    NumberWithoutDotDirective,
    NumberOnlyDirective,
    SelectBidtypeComponent,
    HtmlPreviewComponent,
    SearchGenericComponent,
    DatagridPlanningComponent,
    SelectGenericTypeComponent,
    NumberNegativeDirective,
    DatagridPayableComponent
  ],
  providers: [StandardService]
})
export class DirectivesModule { }
