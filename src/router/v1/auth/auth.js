"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = void 0;
const config_1 = __importDefault(require("config"));
const responseError_1 = __importDefault(require("../components/responseError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const check = async (req, res, next) => {
    var _a, _b;
    try {
        // const authHeader = req?.headers?.authorization || '';
        // const token = authHeader.split(' ')[1]
        // // console.log('token', token);
        // if (token) {
        //   const decoded = jwtDecode<Auth0JwtPayload>(token)
        //   if (decoded?.sub) {
        //     next()
        //   }
        // } else {
        //   res.status(403).json({
        //     status: 403,
        //     code: 'INVALID_TOKEN',
        //     message: 'Invalid token',
        //   })
        // }
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!((_a = `${authHeader}`) === null || _a === void 0 ? void 0 : _a.startsWith('Bearer ')))
            return res.status(401).json({
                status: 401,
                code: 'Unauthorized',
                message: 'Unauthorized',
            });
        const token = (_b = `${authHeader}`) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
        console.log('token in check', token, authHeader);
        jsonwebtoken_1.default.verify(token, config_1.default.get('jwt.secret'), (err, decoded) => {
            if (err)
                return res.status(403).json({
                    status: 403,
                    code: 'INVALID_TOKEN',
                    message: 'Invalid Token',
                }); //invalid token
            if (decoded) {
                next();
            }
        });
    }
    catch (error) {
        (0, responseError_1.default)(error, res);
    }
};
exports.check = check;
