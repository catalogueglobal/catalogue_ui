import { Component, AfterViewInit }                      from '@angular/core';
import { Store }                                         from '@ngrx/store';
import { Observable }                                    from 'rxjs';
import { ToasterService, ToasterConfig, BodyOutputType } from 'angular2-toaster/angular2-toaster';
import { TranslateService }                              from 'ng2-translate/src/translate.service';
import { Configuration }                                 from 'app/modules/common';
import { DatasetsActions }                               from 'app/state/datasets/datasets.actions';
import { DatasetsState }                                 from 'app/state/datasets/datasets.reducer';

@Component({
    selector: 'app-status',
    templateUrl: 'status.component.html'
})
export class StatusComponent implements AfterViewInit {
    private status: Observable<any>;
    public toasterConfig: ToasterConfig = new ToasterConfig({
        showCloseButton: true,
        tapToDismiss: true,
        timeout: 0,
        positionClass: 'toast-bottom-left',
        bodyOutputType: BodyOutputType.TrustedHtml
    });

    constructor(
        private config: Configuration,
        private toasterService: ToasterService,
        private datasetsStore: Store<DatasetsState>,
        private datasetsAction: DatasetsActions,
        private translateService: TranslateService) {
        this.status = datasetsStore.select('datasets').map((datasetsState: DatasetsState) => datasetsState.status);
    }

    ngAfterViewInit() {
        this.status.subscribe(
            statusValue => {
                if (statusValue.errorMessage) {
                    let toast = {
                        type: 'error',
                        body: this.translateService.instant(statusValue.errorMessage, statusValue.errorMessageArgs),
                        timeout: this.config.NOTIFY_ERROR_TIMEOUT
                    };
                    this.toasterService.pop(toast);
                }
            }
        );
    }

    private getStatus() {
        return this.status;
    }

    private clearStatusNotifyMessage() {
        this.datasetsStore.dispatch(this.datasetsAction.statusClearNotifyMessage());
    }
}
