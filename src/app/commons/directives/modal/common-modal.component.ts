import {Component, ViewChild, Input, Output} from '@angular/core';
import {ModalComponent} from './modal.component';

@Component({
    templateUrl: 'modal.html'
})
export class CommonComponent {

    @ViewChild(ModalComponent)
    public readonly modal: ModalComponent;

    constructor(){

    }

    public hide() {
        this.modal.hide();
    }
    public show() {
        this.modal.show();
    }
}
