// sort for angular2, from https://github.com/nicolas2bert/angular2-orderby-pipe/blob/master/app/orderby.ts
import {Pipe, PipeTransform} from "@angular/core";
@Pipe({
  //The @Pipe decorator takes an object with a name property whose value is the pipe name that we'll use within a template expression. It must be a valid JavaScript identifier. Our pipe's name is orderby.
  name: "orderby"
})
export class OrderByPipe implements PipeTransform {
  transform(array: Array<any>, args?) {
    // Check if array exists, in this case array contains articles and args is an array that has 1 element : !id
    if (array) {
      // get the first element
      let orderByValue = args
      let byVal = 1
      // check if exclamation point
      if (orderByValue.charAt(0) == "!") {
        // reverse the array
        byVal = -1
        orderByValue = orderByValue.substring(1)
      }
      console.log("orderby:", byVal, orderByValue);

      array.sort((a: any, b: any) => {
        if (a[orderByValue] < b[orderByValue]) {
          return -1 * byVal;
        } else if (a[orderByValue] > b[orderByValue]) {
          return 1 * byVal;
        } else {
          return 0;
        }
      });
      return array;
    }
    //
  }
}
