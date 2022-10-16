import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddressPipe} from './address.pipe';
import {PricePipe} from './price.pipe';
import {SafeHtmlCustomPipe} from './safe-html.pipe';
import {SortPipe} from './sort.pipe';
import {RoleModifyPipe} from './role-modify.pipe';
import {NumberMinDigitPipe} from './number-min-digit.pipe';
import {SlugToNormalPipe} from './slug-to-normal.pipe';
import {OrderStatusPipe} from './order-status.pipe';
import {ArrayStringPipe} from './array-string.pipe';
import {DiscountPipe} from './discount.pipe';
import {TextWrapPipe} from './text-wrap.pipe';
import {HideDealOfDayPipe} from './hide-deal-of-day.pipe';
import {EmiStatusPipe} from './emi-status.pipe';
import {FormatBytesPipe} from './format-bytes.pipe';
import { YoutubePipe } from './youtube.pipe';


@NgModule({
    declarations: [
        AddressPipe,
        PricePipe,
        SafeHtmlCustomPipe,
        SortPipe,
        RoleModifyPipe,
        NumberMinDigitPipe,
        SlugToNormalPipe,
        OrderStatusPipe,
        ArrayStringPipe,
        DiscountPipe,
        TextWrapPipe,
        HideDealOfDayPipe,
        EmiStatusPipe,
        FormatBytesPipe,
        YoutubePipe
    ],
  imports: [
    CommonModule
  ],
    exports: [
        AddressPipe,
        PricePipe,
        SafeHtmlCustomPipe,
        SortPipe,
        RoleModifyPipe,
        NumberMinDigitPipe,
        SlugToNormalPipe,
        OrderStatusPipe,
        DiscountPipe,
        TextWrapPipe,
        HideDealOfDayPipe,
        EmiStatusPipe,
        FormatBytesPipe
    ]
})
export class PipesModule {
}
