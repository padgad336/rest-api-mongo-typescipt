"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAccessToken = void 0;
const models_1 = require("../../../../models");
const responseError_1 = __importDefault(require("../../components/responseError"));
const util_1 = require("../../../../../config/util");
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const handleAccessToken = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refresh))
            return res.status(401).json({
                status: 401,
                code: 'Unauthorized',
                message: 'Unauthorized',
            });
        const refreshToken = cookies.refresh;
        // res.clearCookie('refresh', { httpOnly: true, sameSite: 'none', secure: true });
        const foundUser = await models_1.UserModel.findOne({ refreshToken }).exec();
        // console.log('foundUser',foundUser);
        // Detected refresh token reuse!
        if (!foundUser) {
            // console.log('in foundUser');
            jsonwebtoken_1.default.verify(refreshToken, config_1.default.get('jwt.secret'), async (err, decoded) => {
                if (err)
                    return res.status(403).json({
                        status: 403,
                        code: 'Forbidden',
                        message: 'Forbidden',
                    }); //Forbidden
                console.log('attempted refresh token reuse!');
                const hackedUser = await models_1.UserModel.findOne({ username: decoded.username }).exec();
                if (hackedUser) {
                    hackedUser.refreshToken = [];
                    const result = await hackedUser.save();
                    console.log(result);
                }
            });
            return res.status(403).json({
                status: 403,
                code: 'Forbidden',
                message: 'Forbidden',
            }); //Forbidden
        }
        const newRefreshTokenArray = foundUser.refreshToken.filter((rt) => rt !== refreshToken);
        // evaluate jwt 
        jsonwebtoken_1.default.verify(refreshToken, config_1.default.get('jwt.secret'), async (err, decoded) => {
            if (err) {
                console.log('expired refresh token');
                foundUser.refreshToken = [...newRefreshTokenArray];
                const result = await foundUser.save();
                console.log(result);
            }
            // console.log('in verify',err, foundUser?._id.toString() ,decoded.id);
            if (err || (foundUser === null || foundUser === void 0 ? void 0 : foundUser._id.toString()) !== decoded.id)
                return res.status(403).json({
                    status: 403,
                    code: 'Forbidden',
                    message: 'Forbidden',
                });
            // Refresh token was still valid
            const roles = foundUser.role;
            const accessToken = await (0, util_1.jwtSign)({
                id: foundUser === null || foundUser === void 0 ? void 0 : foundUser._id,
                role: foundUser === null || foundUser === void 0 ? void 0 : foundUser.role,
            }, "1m");
            // const newRefreshToken  = await jwtSign(
            //   {
            //     id: foundUser?._id,
            //     role: foundUser?.role,
            //   },
            //   "1d"
            // );
            // // Saving refreshToken with current user
            // foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            // const result = await foundUser.save();
            // // Creates Secure Cookie with refresh token
            // res.cookie('refresh', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
            res.json({ roles, accessToken });
        });
    }
    catch (e) {
        (0, responseError_1.default)(e, res);
    }
};
exports.handleAccessToken = handleAccessToken;
