"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLogout = void 0;
const models_1 = require("../../../../models");
const responseError_1 = __importDefault(require("../../components/responseError"));
const handleLogout = async (req, res, next) => {
    try {
        // On client, also delete the accessToken
        const cookies = req.cookies;
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refresh))
            return res.sendStatus(204); //No content
        const refreshToken = cookies.refresh;
        // Is refreshToken in db?
        const foundUser = await models_1.UserModel.findOne({ refreshToken }).exec();
        if (!foundUser) {
            res.clearCookie('refresh', { httpOnly: true, sameSite: 'none', secure: true });
            return res.sendStatus(204);
        }
        // Delete refreshToken in db
        foundUser.refreshToken = foundUser.refreshToken.filter((rt) => rt !== refreshToken);
        ;
        const result = await foundUser.save();
        console.log(result);
        res.clearCookie('refresh', { httpOnly: true, sameSite: 'none', secure: true });
        res.status(200).json({
            status: 200,
            code: 'success',
            message: 'success',
        });
    }
    catch (e) {
        (0, responseError_1.default)(e, res);
    }
};
exports.handleLogout = handleLogout;
