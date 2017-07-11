import {Component, ViewChild, Input, Output} from '@angular/core';
import {CommonComponent} from './common-modal.component';

@Component({
    selector: 'miscdata-modal',
    templateUrl: 'miscdata-modal.html'
})
export class MiscDataModal extends CommonComponent {

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
