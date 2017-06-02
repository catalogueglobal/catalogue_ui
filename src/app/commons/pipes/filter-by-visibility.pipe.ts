// sort for angular2, from https://github.com/nicolas2bert/angular2-orderby-pipe/blob/master/app/orderby.ts
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    //The @Pipe decorator takes an object with a name property whose value is the pipe name that we'll use within a template expression. It must be a valid JavaScript identifier. Our pipe's name is orderby.
    name: "filterbyvisibility"
})
export class FilterByVisibilityPipe implements PipeTransform {

    transform(array: Array<any>, args?) {
        if (array) {

            let res = array.filter((currentValue, index, arr) => {
              if (currentValue.isDisplayed !== undefined){
                  return currentValue.isDisplayed;
              }
              return true;

            })
            //console.log("orderby:", byVal, orderByValue);
            return res;
        }
    }
}
