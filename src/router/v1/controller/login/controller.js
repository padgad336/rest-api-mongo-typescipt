"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogin = void 0;
const models_1 = require("../../../../models");
const responseError_1 = __importDefault(require("../../components/responseError"));
const password_hash_1 = __importDefault(require("password-hash"));
const util_1 = require("../../../../../config/util");
const createLogin = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        console.log(`cookie available at login: ${JSON.stringify(cookies)}`);
        const { username, password } = req.body;
        if (!username || !password)
            return res.status(400).json({ 'message': 'Username and password are required.' });
        const foundUser = await models_1.UserModel.findOne({ username: username }).exec();
        if (!foundUser)
            return res.sendStatus(401); //Unauthorized 
        // evaluate password 
        const match = await password_hash_1.default.verify(password, `${foundUser === null || foundUser === void 0 ? void 0 : foundUser.password}`);
        if (match) {
            const roles = foundUser.role;
            // create JWTs
            const accessToken = await (0, util_1.jwtSign)({
                id: foundUser === null || foundUser === void 0 ? void 0 : foundUser._id,
                role: foundUser === null || foundUser === void 0 ? void 0 : foundUser.role,
            }, "1m");
            const newRefreshToken = await (0, util_1.jwtSign)({
                id: foundUser === null || foundUser === void 0 ? void 0 : foundUser._id,
                role: foundUser === null || foundUser === void 0 ? void 0 : foundUser.role,
            }, "1d");
            // Changed to let keyword
            let newRefreshTokenArray = !(cookies === null || cookies === void 0 ? void 0 : cookies.refresh)
                ? foundUser.refreshToken
                : foundUser.refreshToken.filter((rt) => rt !== cookies.refresh);
            if (cookies === null || cookies === void 0 ? void 0 : cookies.refresh) {
                /*
                Scenario added here:
                    1) UserModel logs in but never uses RT and does not logout
                    2) RT is stolen
                    3) If 1 & 2, reuse detection is needed to clear all RTs when username logs in
                */
                const refreshToken = cookies.refresh;
                const foundToken = await models_1.UserModel.findOne({ refreshToken }).exec();
                // Detected refresh token reuse!
                if (!foundToken) {
                    console.log('attempted refresh token reuse at login!');
                    // clear out ALL previous refresh tokens
                    newRefreshTokenArray = [];
                }
                res.clearCookie('refresh', { httpOnly: true, sameSite: 'none', secure: true });
            }
            // Saving refreshToken with current username
            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            const result = await foundUser.save();
            console.log(result);
            console.log(roles);
            // Creates Secure Cookie with refresh token
            res.cookie('refresh', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
            // Send authorization roles and access token to username
            res.json({ roles, accessToken });
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (e) {
        (0, responseError_1.default)(e, res);
    }
};
exports.createLogin = createLogin;
