import {Component, ViewChild, Input, Output} from '@angular/core';
import {CommonComponent} from './common-modal.component';

@Component({
    selector: 'confirm-feed-version-modal',
    templateUrl: 'confirm-feed-version-modal.html'
})
export class ConfirmFeedVersionModal extends CommonComponent {
    @Input()
    onSubmit: Function;

    validate() {
        if (this.onSubmit) {
            this.onSubmit(true);
        }
    }
    cancel () {
        super.hide();
        if (this.onSubmit) {
            this.onSubmit(false);
        }
    }
}
