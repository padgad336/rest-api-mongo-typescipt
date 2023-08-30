"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const mongoose_1 = __importDefault(require("mongoose"));
const bluebird_1 = __importDefault(require("bluebird"));
const { uri, mongooseOptions } = config_1.default.get('db.mongodb');
// console.log('moo', mongooseOptions);
const options = Object.assign(Object.assign({}, mongooseOptions), { promiseLibrary: bluebird_1.default });
mongoose_1.default.Promise = bluebird_1.default;
console.log('env', config_1.default.get('env'));
if (config_1.default.get('env') === 'production') {
    mongoose_1.default.connect(uri, options);
}
else {
    mongoose_1.default.connect(`${uri}`);
}
