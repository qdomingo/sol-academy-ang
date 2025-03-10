import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthNamePipe} from '../pipes/month-name.pipe';
import { DecimalFormatPipe} from '../pipes/decimal-format.pipe';


@NgModule({
  declarations: [MonthNamePipe, DecimalFormatPipe],
  imports: [
    CommonModule
  ],
  exports: [MonthNamePipe, DecimalFormatPipe]
})
export class PipesModule { }