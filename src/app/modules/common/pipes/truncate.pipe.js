"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// truncate.ts
var core_1 = require("@angular/core");
var TruncatePipe = (function () {
    function TruncatePipe() {
    }
    TruncatePipe.prototype.transform = function (value, args) {
        var radix = 10;
        var limitCount = 30;
        var limit = (args && args.length > 0) ? parseInt(args[0], radix) : limitCount;
        var trail = (args && args.length > 1) ? args[1] : '...';
        return value.length > limit ? value.substring(0, limit) + trail : value;
    };
    return TruncatePipe;
}());
TruncatePipe = __decorate([
    core_1.Pipe({
        name: 'truncate'
    }),
    core_1.Injectable()
], TruncatePipe);
exports.TruncatePipe = TruncatePipe;
