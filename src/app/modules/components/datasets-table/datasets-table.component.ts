import { Component, Injector, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { PaginationService } from 'ng2-pagination';
import { ValidationDetailsModal } from '../modal/validation-details-modal.component';

import {
    IFeedRow,
    SortOrder
} from 'app/modules/common/';

import {  DatasetsActionType } from 'app/state/datasets/datasets.actions';
import { DatasetsGenericComponent } from '../datasets-generic/datasets-generic.component';

@Component({
    selector: 'app-datasets-table',
    templateUrl: 'datasets-table.component.html',
    providers: [PaginationService]
})
export class DatasetsTableComponent extends DatasetsGenericComponent {
    @Input() protected _feeds: IFeedRow[];
    @Output() protected sortChange = new EventEmitter();
    @ViewChild(ValidationDetailsModal)
    public readonly validationDetailsModal: ValidationDetailsModal;

    private page: number;

    protected currentSort: SortOrder = {
        sort: 'name',
        order: 'asc'
    };

    constructor(injector: Injector) {
        super(injector);
        this.subscribeActions(this.actions$);
    }

    // overriden by childs
    @Input() set feeds(value: any) {

        this.getLicenses(value);
        if (!value) {
            this._feeds = null;
            return;
        }
        this._feeds = value;
    }

    // overriden by childs
    get feeds() {
        return this._feeds;
    }

    protected setSort(sort) {
        this.sortChange.emit(sort);
    }

    protected regionStateCountry(feed) {
        return this.utils.regionStateCountry(feed);
    }

    protected subscribeActions(actions$) {
        // close inline edit form on setName() success
        actions$.ofType(DatasetsActionType.USER_SUBSCRIBE_SUCCESS).subscribe(
            () => {
                console.log('USER_SUBSCRIBE setting profile');
                this.sessionService.setProfile();
            }
        );
        actions$.ofType(DatasetsActionType.UNSUBSCRIBE_FEED_SUCCESS).subscribe(
            () => {
                console.log('UNSUBSCRIBE_FEED setting profile');
                this.sessionService.setProfile();
            }
        );
    }

    protected openValidation(feed) {
        super.openValidation(feed);
        if (feed && feed.selectedVersion && feed.selectedVersion.id) {
            this.validationDetailsModal.show();
        }
    }

    public resetPage() {
        this.page = 1;
    }
}
