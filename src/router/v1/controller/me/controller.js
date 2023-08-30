"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = void 0;
const models_1 = require("../../../../models");
const responseError_1 = __importDefault(require("../../components/responseError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const getMe = async (req, res, next) => {
    try {
        // On client, also delete the accessToken
        const cookies = req.cookies;
        //  console.log('cookie',cookies);
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refresh))
            return res.sendStatus(204); //No content
        const refreshToken = cookies.refresh;
        jsonwebtoken_1.default.verify(refreshToken, config_1.default.get('jwt.secret'), async (err, decoded) => {
            if (err) {
                console.log('in me ', err);
                res.status(403).json({
                    status: 403,
                    code: 'INVALID_TOKEN',
                    message: 'Invalid Token',
                });
            }
            const foundUser = await models_1.UserModel.findOne({ _id: decoded === null || decoded === void 0 ? void 0 : decoded.id }).exec();
            console.log('founin me', foundUser);
            res.status(200).json({
                firstname: foundUser === null || foundUser === void 0 ? void 0 : foundUser.firstname,
                lastname: foundUser === null || foundUser === void 0 ? void 0 : foundUser.lastname,
                username: foundUser === null || foundUser === void 0 ? void 0 : foundUser.username,
                id: foundUser === null || foundUser === void 0 ? void 0 : foundUser._id.toString()
            });
        });
    }
    catch (e) {
        (0, responseError_1.default)(e, res);
    }
};
exports.getMe = getMe;
