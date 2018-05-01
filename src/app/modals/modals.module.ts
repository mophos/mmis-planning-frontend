import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
import { AdjustPlanningComponent } from './adjust-planning/adjust-planning.component';
import { CopyPlanningComponent } from './copy-planning/copy-planning.component';
import { PipesModule } from '../pipes/pipes.module';
import { UploadExcelComponent } from './upload-excel/upload-excel.component';
import { MergePlanningComponent } from './merge-planning/merge-planning.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    ClarityModule,
    PipesModule
  ],
  declarations: [LoadingComponent, AdjustPlanningComponent, CopyPlanningComponent, UploadExcelComponent, MergePlanningComponent],
  exports: [LoadingComponent, AdjustPlanningComponent, CopyPlanningComponent, UploadExcelComponent, MergePlanningComponent]
})
export class ModalsModule { }
