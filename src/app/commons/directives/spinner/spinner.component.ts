// inspired from https://github.com/WoltersKluwerPL/ng2-spin-kit/blob/master/app/spinner/three-bounce/three-bounce.ts
import {Component, Input, OnDestroy} from '@angular/core';

@Component({
    selector: 'app-spinner',
    templateUrl: 'spinner.component.html',
    styleUrls: ['spinner.component.css']
})
export class SpinnerComponent implements OnDestroy {
    private visible: boolean = true;
    private timeout: any;
    @Input() public delay: number = 0;

    @Input() public set isRunning(value: boolean) {
        if (!value) {
            this.cancel();
            this.visible = false;
        }
        if (this.timeout) {
            return;
        }
        this.timeout = setTimeout(
            () => {
                this.visible = true;
                this.cancel();
            },
            this.delay
        );
    }

    private cancel(): void {
        clearTimeout(this.timeout);
        this.timeout = undefined;
    }

    ngOnDestroy(): any {
        this.cancel();
    }
}
