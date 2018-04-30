import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToThaiDatePipe } from './to-thai-date.pipe';
import { ToThaiDateTimePipe } from './to-thai-date-time.pipe';
import { StatusPipe } from './status.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ToThaiDatePipe, ToThaiDateTimePipe, StatusPipe],
  exports: [ToThaiDatePipe, ToThaiDateTimePipe, StatusPipe]
})
export class PipesModule { }
