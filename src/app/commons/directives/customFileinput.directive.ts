import { Directive, ElementRef } from "@angular/core";

/**
 * customFileinput integration.
 */
@Directive({
    selector: 'input[type=file]'
})
export class CustomFileinputDirective {
    constructor(el: ElementRef) {
        customFileinput(el.nativeElement);
    }
}
