import {Component, Input, Output, EventEmitter} from "@angular/core";
import {IFeedRow} from "../datasets/datasets.component";
import {PaginationService} from "ng2-pagination";
import {Configuration} from "../../commons/configuration";
import {SortOrder} from "../../commons/directives/sort-link/sort-link.component";
import {UtilsService} from "../../commons/services/utils.service";
import {FEED_RETRIEVAL_METHOD} from "../../commons/services/api/feedsApi.service";
//import {Map} from "@angular/core/src/facade/collection";

@Component({
  selector: 'app-datasets-table',
  templateUrl: 'datasets-table.component.html',
  providers: [PaginationService]
})
export class DatasetsTableComponent {

  @Input() protected _feeds: IFeedRow[];
  @Input() protected chkAll: boolean = false;
  @Output() protected sortChange = new EventEmitter();
  private FEED_RETRIEVAL_METHOD = FEED_RETRIEVAL_METHOD; // used by the template

  private checkById: Map<string,boolean> = new Map<string,boolean>();
  private page:number;

  protected currentSort: SortOrder = {
    sort: 'name',
    order: 'asc'
  };

  constructor(protected config: Configuration, private utils: UtilsService) {
  }

  // overriden by childs
  @Input() set feeds(value: any) {
    if (!value) {
      this._feeds = null
      return
    }
    this._feeds = value
  }

  // overriden by childs
  get feeds() {
    return this._feeds;
  }

  protected setSort(sort) {
    this.sortChange.emit(sort);
  }

  protected checkAll() {
    let newValue = !this.chkAll;
    this.feeds.forEach(feed => {
      this.checkById[feed.id] = newValue;
    });
    this.chkAll = newValue;
  }

  protected regionStateCountry(feed) {
    return this.utils.regionStateCountry(feed);
  }

  public getCheckedFeeds(): IFeedRow[] {
    if (!this.feeds) {
      // component not initialized yet
      return [];
    }
    return this.feeds.filter(feed => this.checkById[feed.id]);
  }

  public resetPage() {
    this.page = 1;
  }

}
