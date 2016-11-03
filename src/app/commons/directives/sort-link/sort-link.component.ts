import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {UtilsService} from "../../services/utils.service";

export type SortOrder = {
  sort: string,
  order: string
}

@Component({
  selector: 'app-sort-link',
  templateUrl: 'sort-link.component.html'
})

export class SortLinkComponent implements OnInit {
  private _value: SortOrder;
  @Input() private sortValue: string;
  @Input() private defaultOrder: string;
  @Output() private valueChange = new EventEmitter();
  private nextOrder = this.defaultOrder;

  constructor(private utils:UtilsService) {
  }

  @Input()
  private set value(value: SortOrder) {
    this._value = value;
    this.nextOrder = this.computeNextOrder();
  }

  public ngOnInit() {
  }

  private computeNextOrder() {
    if (this._value.sort != this.sortValue) {
      return this.defaultOrder;
    }
    else {
      return this.utils.toggleOrder(this._value.order);
    }
  }

  clicked() {
    let nextValue = {
      sort: this.sortValue,
      order: this.nextOrder
    }
    this._value = nextValue;
    this.valueChange.emit(nextValue);
  }

}
