"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../../../../models");
const responseError_1 = __importDefault(require("../../../components/responseError"));
const checkUserName = async (req, res, next) => {
    try {
        const { username } = req.params;
        const response = await models_1.UserModel.find({ username: { $in: username } });
        // console.log('response', response);
        if (response) {
            res.send(response);
            //    res.status(200).json({
            //      status: 200,
            //      code: 'SUCCESS_USER_FIND',
            //      message: 'Find User Success.',
            //    });
        }
    }
    catch (e) {
        (0, responseError_1.default)(e, res);
    }
};
exports.default = checkUserName;
