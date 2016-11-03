import {datasetsReducer, DatasetsState} from "./datasets/datasets.reducer";
export interface AppState extends DatasetsState {
}

export let appReducer = {
  datasets: datasetsReducer
};

export default appReducer;
