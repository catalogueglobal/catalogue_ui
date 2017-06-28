import {Component, ViewChild, Input, Output} from '@angular/core';
import {CommonComponent} from './common-modal.component';
import { Http } from "@angular/http";

@Component({
    selector: 'validation-details-modal',
    templateUrl: 'validation-details-modal.html'
})
export class ValidationDetailsModal extends CommonComponent {
    _fileUrl: string;
    datas = {
        errors: []
    };

    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };

    public pieChartLabels: string[] = [];
    public pieChartData: number[] = [];
    public pieChartType: string = 'pie';

    public barChartLabels: string[];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;
    public barChartData: any[] = [
        { data: [], label: '' }
    ];
    zoomChart = false;

    formattedDatas = {};

    barColors: Array<any> = [];

    constructor(private http: Http) {
        super();
    }

    @Input() set fileUrl(value: any) {
        this._fileUrl = value;
        if (value) {
            this.http.get(value).map(response => response.json()).subscribe(
                data => {
                    this.datas = data;
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
                }
            )
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
        console.log(e);
    }

    public barHovered(e: any): void {
        console.log(e);
    }

    public pieClicked(e: any): void {
        this.zoomChart = true;
        this.buildBarDatas(this.pieChartLabels[e.active[0]._index], e.active[0]._view.backgroundColor);
        console.log(e);
    }

    public pieHovered(e: any): void {
        console.log(e);
    }
}
