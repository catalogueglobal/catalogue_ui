import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Configuration }       from '../services/configuration';

@Pipe({ name: 'institutionalUrl' })
@Injectable()
export class InstitutionalUrlPipe implements PipeTransform {

    constructor(private conf: Configuration) {
    }

    transform(value: string): string {
        return this.conf.INSTITUTIONAL_URL + value;
    }
}
