"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtSign = void 0;
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSign = (payload, expiresIn = '2m') => jsonwebtoken_1.default.sign(payload, config_1.default.get('jwt.secret'), { expiresIn });
exports.jwtSign = jwtSign;
exports.default = {
    jwtSign: exports.jwtSign,
};
