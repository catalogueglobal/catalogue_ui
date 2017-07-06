// truncate.ts
import {Injectable, Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'truncate'
})
@Injectable()
export class TruncatePipe implements PipeTransform {
    transform(value: string, args: string[]): string {
        let radix = 10;
        let limitCount = 30;
        let limit = (args && args.length > 0) ? parseInt(args[0], radix) : limitCount;
        let trail = (args && args.length > 1) ? args[1] : '...';

        return value.length > limit ? value.substring(0, limit) + trail : value;
    }
}
