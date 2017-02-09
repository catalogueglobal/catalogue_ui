import { Pipe, PipeTransform } from '@angular/core';
import { Configuration }       from "../configuration";

@Pipe({name: 'institutionalUrl'})
export class InstitutionalUrlPipe implements PipeTransform {

    constructor(private conf:Configuration) {
    }

    transform(value:string):string {
        return this.conf.INSTITUTIONAL_URL + value;
    }
}
