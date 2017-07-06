import { EventEmitter } from '@angular/core';
import {IFeed} from '../services/api/feedsApi.service';

export type SortOrder = {
    sort: string,
    order: string
}

export type InlineEditEvent<T> = {
    confirm$: EventEmitter<any>,
    value: T
}

export type IFeedRow = IFeed & {
    checked
}
