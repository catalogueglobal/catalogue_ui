import {Injectable} from "@angular/core";
import {SortOrder} from "../../directives/sort-link/sort-link.component";
import {IFeed, IBounds} from "./feedsApi.service";
import {UtilsService} from "../utils.service";

@Injectable()
export class LocalFiltersService {

  constructor(private utils: UtilsService) {
  }

  public filterFeedsInArea(feeds: IFeed[], area: IBounds) {
    console.log("FILTER FEEDS IN AREA", feeds);
    return feeds.filter(feed => this.isFeedWithinArea(feed, area));
  }

  private isFeedWithinArea(feed: IFeed, area: IBounds): boolean {
    if (!feed.latestValidation || !feed.latestValidation.bounds) {
      return false;
    }
    let feedBounds = feed.latestValidation.bounds;

    if (
      // feed at west of area
    feedBounds.east < area.west ||
    // feed at east of area
    feedBounds.west > area.east) {
      // latitude KO
      return false
    }

    if (
      // feed at north of area
    feedBounds.south > area.north ||
    // feed at south of area
    feedBounds.north < area.south) {
      // longitude KO
      return false
    }
    return true;
  }

  private isPointWithinArea(lat: number, lng: number, area: IBounds): boolean {
    if (lat >= area.west && lat <= area.east) {
      if (lng >= area.south && lng <= area.north) {
        return true;
      }
    }
    return false;
  }

  public sortFeeds(feeds, sortOrder: SortOrder) {
    let sortProperty;

    switch (sortOrder.sort) {
      case 'regionStateCountry':
        sortProperty = (feed)=>this.utils.regionStateCountry(feed);
        break;

      case 'lastUpdated':
        sortProperty = (feed)=> {
          let value = feed.lastUpdated;
          if (!value) { // lastUpdated may be empty
            value = 0;
          }
          return value
        }
        break;

      default:
        sortProperty = (feed)=>feed[sortOrder.sort];
        break;
    }

    let sortFactor = sortOrder.order == 'asc' ? 1 : -1;

    let res = this.computeSort(feeds, sortFactor, sortProperty)
    return res;
  }

  private computeSort(array, byVal, sortProperty) {
    array.sort((a: any, b: any) => {
      let aValue = sortProperty(a);
      let bValue = sortProperty(b);

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === "string") {
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return -1 * byVal;
      } else if (aValue > bValue) {
        return 1 * byVal;
      } else {
        return 0;
      }
    });
    return array;
  }

}
