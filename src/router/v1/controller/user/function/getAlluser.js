"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseError_1 = __importDefault(require("../../../components/responseError"));
const user_1 = __importDefault(require("../../../../../models/user"));
const getAllUser = async (req, res, next) => {
    try {
        const response = await user_1.default.find();
        // console.log(response);
        if (response) {
            res.status(200).json(response);
        }
    }
    catch (e) {
        (0, responseError_1.default)(e, res);
    }
};
exports.default = getAllUser;
