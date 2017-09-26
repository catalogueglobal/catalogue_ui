"use strict";
var datasets_reducer_1 = require("./datasets/datasets.reducer");
exports.appReducer = {
    datasets: datasets_reducer_1.datasetsReducer,
    mydatasets: datasets_reducer_1.datasetsReducer
};
exports.__esModule = true;
exports["default"] = exports.appReducer;
