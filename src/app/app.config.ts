import {Injectable} from '@angular/core';

@Injectable()
export class AppConfig {

    private static cache = {};
    constructor(public data: any) { }

    public static loadInstance(jsonFile: string) {
        return new Promise((resolve, reject) => {
            let xobj = new XMLHttpRequest();
            xobj.overrideMimeType('application/json');
            xobj.open('GET', jsonFile, true);
            xobj.onreadystatechange = () => {
                if (xobj.readyState === 4) {
                    if (xobj.status === 200) {
                        this.cache[jsonFile] = new AppConfig(JSON.parse(xobj.responseText));
                        resolve();
                    }
                    else {
                        reject(`Could not load file '${jsonFile}': ${xobj.status}`);
                    }
                }
            };
            xobj.send(null);
        });
    }

    public static getInstance(jsonFile: string): AppConfig {
        if (jsonFile in this.cache) {
            return this.cache[jsonFile];
        }
        throw `Could not find config '${jsonFile}', did you load it?`;
    }

    public get(key: string) {
        if (this.data === null) {
            return null;
        }
        if (key in this.data) {
            return this.data[key];
        }
        return null;
    }
}
