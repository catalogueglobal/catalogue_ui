import {Component, ViewChild, ViewChildren, Input, Output} from '@angular/core';
import {CommonComponent} from './common-modal.component';
import { Http } from '@angular/http';
import {FilterPipe} from 'app/modules/common/';

@Component({
    selector: 'validation-details-modal',
    templateUrl: 'validation-details-modal.html'
})
export class ValidationDetailsModal extends CommonComponent {
    _fileUrl: string;
    public barChartOptions: any;
    public pieChartLabels: string[];
    public pieChartData: number[];
    public pieChartType;

    public barChartLabels: string[] = [];
    public barChartType;
    public barChartLegend = true;
    public barChartData: any[];
    zoomChart = false;

    formattedDatas = {};

    barColors: Array<any> = [];
    filteredItems = [];
    filteredObj: any = {};
    datasLoading;

    constructor(private http: Http, private filter: FilterPipe) {
        super();
    }

    initVars() {
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
    }

    @Input() set fileUrl(value: any) {
        this.initVars();
        this._fileUrl = value;

        if (value) {
            this.datasLoading = true;
            this.http.get(value).map(response => response.json()).subscribe(
                data => {
                    let keys = Object.keys(data.tripsPerDate);
                    let years = [];
                    for (let i = 0; i < keys.length; i++) {
                        let year = new Date(keys[i]).getFullYear();
                        if (!this.formattedDatas[year]) {
                            this.formattedDatas[year] = {
                                items: {},
                                count: 0
                            };
                            years.push(year);
                        }
                        this.formattedDatas[year].items[keys[i]] = data.tripsPerDate[keys[i]];
                        this.formattedDatas[year].count += data.tripsPerDate[keys[i]];
                    }
                    this.pieChartLabels = years;
                    let counts = [];
                    for (let i = 0; i < years.length; i++) {
                        counts.push(this.formattedDatas[years[i]].count);
                    }
                    this.pieChartData = counts;
                    this.filteredObj.all = data.errors;
                    this.filteredItems = this.getAllItems();
                    this.filteredObj.low = this.filter.transform(data.errors, 'priority', 'LOW');
                    this.filteredObj.medium = this.filter.transform(data.errors, 'priority', 'MEDIUM');
                    this.filteredObj.high = this.filter.transform(data.errors, 'priority', 'HIGH');
                    this.datasLoading = false;
                },
                error => {
                    this.datasLoading = false;
                    console.log(error);
                    this.hide();
                }
            );
        }
    }

    buildBarDatas(year, backgroundColor) {
        let yearData = this.formattedDatas[year].items;
        let keys = Object.keys(yearData);
        this.barChartLabels = keys.sort((a, b) => {
            return a.localeCompare(b);
        });
        let values = [];
        for (let i = 0; i < this.barChartLabels.length; i++) {
            values.push(yearData[this.barChartLabels[i]]);
        }
        this.barChartData[0].data = values;
        this.barChartData[0].label = year;
        this.barColors = [{ backgroundColor: backgroundColor || '#dea627' }];
    }

    displayDetailsType(item, type) {
        if (item[type] === undefined) {
            item[type] = false;
        }
        item[type] = !item[type];
    }

    download() {
        window.open(this._fileUrl);
    }

    // events
    public barClicked(e: any): void {
        this.zoomChart = false;
    }

    public barHovered(e: any): void {
    }

    public pieClicked(e: any): void {
        this.zoomChart = true;
        this.buildBarDatas(this.pieChartLabels[e.active[0]._index], e.active[0]._view.backgroundColor);
    }

    public pieHovered(e: any): void {
    }

    private getAllItems(): any[] {
        let res = [];
        res = this.filteredObj.all.sort((a, b) => {
            return 0.5 - Math.random();
        });
        return res;
    }
}
