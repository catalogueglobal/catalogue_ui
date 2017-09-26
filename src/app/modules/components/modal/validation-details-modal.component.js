"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var common_modal_component_1 = require("./common-modal.component");
var ValidationDetailsModal = (function (_super) {
    __extends(ValidationDetailsModal, _super);
    function ValidationDetailsModal(http, filter) {
        var _this = _super.call(this) || this;
        _this.http = http;
        _this.filter = filter;
        _this.barChartLabels = [];
        _this.barChartLegend = true;
        _this.zoomChart = false;
        _this.formattedDatas = {};
        _this.barColors = [];
        _this.filteredItems = [];
        _this.filteredObj = {};
        return _this;
    }
    ValidationDetailsModal.prototype.initVars = function () {
        this._fileUrl = undefined;
        this.datasLoading = false;
        this.barChartOptions = {
            scaleShowVerticalLines: false,
            responsive: true
        };
        this.pieChartLabels = [];
        this.pieChartData = [];
        this.pieChartType = 'pie';
        this.barChartLabels = [];
        this.barChartType = 'bar';
        this.barChartLegend = true;
        this.barChartData = [
            { data: [], label: '' }
        ];
        this.zoomChart = false;
        this.formattedDatas = {};
        this.barColors = [];
        this.filteredItems = [];
        this.filteredObj = {
            all: [],
            low: [],
            medium: [],
            high: []
        };
    };
    Object.defineProperty(ValidationDetailsModal.prototype, "fileUrl", {
        set: function (value) {
            var _this = this;
            this.initVars();
            this._fileUrl = value;
            if (value) {
                this.datasLoading = true;
                this.http.get(value).map(function (response) { return response.json(); }).subscribe(function (data) {
                    var keys = Object.keys(data.tripsPerDate);
                    var years = [];
                    for (var i = 0; i < keys.length; i++) {
                        var year = new Date(keys[i]).getFullYear();
                        if (!_this.formattedDatas[year]) {
                            _this.formattedDatas[year] = {
                                items: {},
                                count: 0
                            };
                            years.push(year);
                        }
                        _this.formattedDatas[year].items[keys[i]] = data.tripsPerDate[keys[i]];
                        _this.formattedDatas[year].count += data.tripsPerDate[keys[i]];
                    }
                    _this.pieChartLabels = years;
                    var counts = [];
                    for (var i = 0; i < years.length; i++) {
                        counts.push(_this.formattedDatas[years[i]].count);
                    }
                    _this.pieChartData = counts;
                    _this.filteredObj.all = data.errors;
                    _this.filteredItems = _this.getAllItems();
                    _this.filteredObj.low = _this.filter.transform(data.errors, 'priority', 'LOW');
                    _this.filteredObj.medium = _this.filter.transform(data.errors, 'priority', 'MEDIUM');
                    _this.filteredObj.high = _this.filter.transform(data.errors, 'priority', 'HIGH');
                    _this.datasLoading = false;
                }, function (error) {
                    _this.datasLoading = false;
                    console.log(error);
                    _this.hide();
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    ValidationDetailsModal.prototype.buildBarDatas = function (year, backgroundColor) {
        var yearData = this.formattedDatas[year].items;
        var keys = Object.keys(yearData);
        this.barChartLabels = keys.sort(function (a, b) {
            return a.localeCompare(b);
        });
        var values = [];
        for (var i = 0; i < this.barChartLabels.length; i++) {
            values.push(yearData[this.barChartLabels[i]]);
        }
        this.barChartData[0].data = values;
        this.barChartData[0].label = year;
        this.barColors = [{ backgroundColor: backgroundColor || '#dea627' }];
    };
    ValidationDetailsModal.prototype.displayDetailsType = function (item, type) {
        if (item[type] === undefined) {
            item[type] = false;
        }
        item[type] = !item[type];
    };
    ValidationDetailsModal.prototype.download = function () {
        window.open(this._fileUrl);
    };
    // events
    ValidationDetailsModal.prototype.barClicked = function (e) {
        this.zoomChart = false;
    };
    ValidationDetailsModal.prototype.barHovered = function (e) {
    };
    ValidationDetailsModal.prototype.pieClicked = function (e) {
        this.zoomChart = true;
        this.buildBarDatas(this.pieChartLabels[e.active[0]._index], e.active[0]._view.backgroundColor);
    };
    ValidationDetailsModal.prototype.pieHovered = function (e) {
    };
    ValidationDetailsModal.prototype.getAllItems = function () {
        var res = [];
        res = this.filteredObj.all.sort(function (a, b) {
            return 0.5 - Math.random();
        });
        return res;
    };
    return ValidationDetailsModal;
}(common_modal_component_1.CommonComponent));
__decorate([
    core_1.Input()
], ValidationDetailsModal.prototype, "fileUrl");
ValidationDetailsModal = __decorate([
    core_1.Component({
        selector: 'validation-details-modal',
        templateUrl: 'validation-details-modal.html'
    })
], ValidationDetailsModal);
exports.ValidationDetailsModal = ValidationDetailsModal;
