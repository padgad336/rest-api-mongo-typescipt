"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../../../../models");
const responseError_1 = __importDefault(require("../../../components/responseError"));
const password_hash_1 = __importDefault(require("password-hash"));
const createUser = async (req, res, next) => {
    try {
        const { role, username, password, firstname, lastname, email, mobile } = req.body;
        const hashedPassword = password_hash_1.default.generate(password);
        const userData = {
            username,
            password: hashedPassword,
            firstname,
            lastname,
            role,
            email,
            mobile,
        };
        const response = await models_1.UserModel.create(userData);
        console.log(response);
        if (response) {
            res.status(200).json({
                status: 200,
                code: 'SUCCESS_USER_CREATE',
                message: 'Created User Success.',
            });
        }
    }
    catch (e) {
        (0, responseError_1.default)(e, res);
    }
};
exports.default = createUser;
