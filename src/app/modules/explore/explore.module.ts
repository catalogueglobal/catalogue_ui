import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
} from './';

let _entryPoints = [
];

let _declarations: Array<any> = [
];

export function entryPoints() {
    return _entryPoints;
}

export function exports() {
    return declarations().concat([]);
}

export function declarations() {
    return _declarations.concat(_entryPoints);
}

export function providers() {
    return [
    ];
}

@NgModule({
    declarations: declarations(),
    imports: [
        CommonModule,
        FormsModule
    ],
    entryComponents: entryPoints(),
    providers: providers(),
    exports: exports()
})
export class ExploreModule { }
