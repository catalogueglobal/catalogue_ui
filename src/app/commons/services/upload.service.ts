import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';

@Injectable()
export class UploadService {

    constructor() {
    }
    
    upload(url: string, formData: FormData, headers?: Map<string,string>): Observable<any> {
        return Observable.create(
            observer => {
                let xhr: XMLHttpRequest = new XMLHttpRequest();
                xhr.onreadystatechange =
                    () => {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200 || xhr.status == 302 || xhr.status == 304) {
                                //observer.next(JSON.parse(xhr.response));&
                                observer.complete();
                            } else {
                                observer.error(xhr.response);
                            }
                        }
                    };
                xhr.upload.onprogress =
                    (event) => {
                        let progress = Math.round(event.loaded / event.total * 100);
                        observer.next(progress);
                    };
                xhr.open('POST', url, true);
                if (headers) {
                    headers.forEach(
                        (value, name) => {
                            xhr.setRequestHeader(name, value);
                        }
                    );
                }
                xhr.send(formData);
            }
        );
    }
}
