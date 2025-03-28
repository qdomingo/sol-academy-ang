import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthNamePipe} from '../pipes/month-name.pipe';
import { DecimalFormatPipe} from '../pipes/decimal-format.pipe';
import { NewlineToBrPipe } from '../pipes/newline-to-br.pipe';

@NgModule({
  declarations: [MonthNamePipe, DecimalFormatPipe, NewlineToBrPipe],
  imports: [
    CommonModule
  ],
  exports: [MonthNamePipe, DecimalFormatPipe, NewlineToBrPipe]
})
export class PipesModule { }