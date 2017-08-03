import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'feedRouteFilter',
    pure: false
})
export class FeedRouteFilter implements PipeTransform {
    transform(items: any[], filter: string): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be kept, false will be filtered out
        return items.filter(item => {
            if (item.routeLongName) {
                return item.routeLongName.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
            }
            return false;
        });
    }
}
