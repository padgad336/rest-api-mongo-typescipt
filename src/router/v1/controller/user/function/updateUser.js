"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseError_1 = __importDefault(require("../../../components/responseError"));
const user_1 = __importDefault(require("../../../../../models/user"));
const updateUserById = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { id, username, firstname, password, lastname, email, mobile } = req.body;
        const userData = {
            id,
            username,
            password,
            firstname,
            lastname,
            email,
            mobile,
        };
        const response = await user_1.default.findByIdAndUpdate({ _id: userId }, userData);
        // console.log(response);
        if (response) {
            res.status(200).json({
                status: 200,
                code: 'SUCCESS_USER_UPDATE',
                message: 'Updated User Success.',
            });
        }
    }
    catch (e) {
        (0, responseError_1.default)(e, res);
    }
};
exports.default = updateUserById;
