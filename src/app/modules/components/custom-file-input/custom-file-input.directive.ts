import { Directive, ElementRef } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';

/**
 * customFileinput integration.
 */
@Directive({
    selector: 'input[type=file]'
})
export class CustomFileinputDirective {
    constructor(el: ElementRef, translate: TranslateService) {
        if (el.nativeElement.className.indexOf('ct-file-input') > -1) {
            return;
        }
        translate.get('popup.upload.browse').subscribe(
            value => {
                customFileinput(el.nativeElement, value);
            }
        );
    }
}
