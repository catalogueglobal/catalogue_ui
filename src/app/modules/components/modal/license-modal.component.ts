import {Component, ViewChild, Input, Output} from '@angular/core';
import {CommonComponent} from './common-modal.component';

@Component({
    selector: 'license-modal',
    templateUrl: 'license-modal.html'
})
export class LicenseModal extends CommonComponent {

    @Input()
    public newLicenseOrMiscData: any;
    @Input()
    public utils: any;

    @Input()
    public items: Array<any>;
    @Input()
    public onSelectionChange: Function;
    @Input()
    onItemChanged: Function;
    @Input()
    onSubmit: Function;
}
