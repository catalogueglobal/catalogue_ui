import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
@Injectable()
export class FilterPipe implements PipeTransform {
  transform(items: any[], field: string, value: string, result: any = {}): any[] {
    if (!items) {
      result.items = [];
      return result.items;
    }
    if (!value || value.length === 0) {
      result.items = items;
      return result.items;
    }
    result.items = items.filter(it => it[field] === value);
    return result.items;
  }
}
