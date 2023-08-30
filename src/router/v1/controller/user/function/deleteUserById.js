"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseError_1 = __importDefault(require("../../../components/responseError"));
const user_1 = __importDefault(require("../../../../../models/user"));
const deleteUserById = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const response = await user_1.default.findByIdAndRemove({ _id: userId });
        console.log(response);
        if (response) {
            res.status(200).json({
                status: 200,
                code: 'SUCCESS_USER_REMOVE',
                message: 'Removed User Success.',
            });
        }
    }
    catch (e) {
        (0, responseError_1.default)(e, res);
    }
};
exports.default = deleteUserById;
