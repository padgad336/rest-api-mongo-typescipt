"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessControlCommittee = exports.manager = exports.admin = exports.businessPdpa = void 0;
const responseError_1 = __importDefault(require("../components/responseError"));
const models_1 = require("src/models");
const businessPdpa = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refresh))
            return res.status(401).json({
                status: 401,
                code: 'Unauthorized',
                message: 'Unauthorized',
            });
        const refreshToken = cookies.refresh;
        const foundUser = await models_1.UserModel.findOne({ refreshToken }).exec();
        if (foundUser.role == 'businessPdpa') {
            next();
        }
        else {
            res.status(403).json({
                status: 403,
                code: 'ERROR_ACCESS',
                message: 'Access denied',
            });
        }
    }
    catch (error) {
        (0, responseError_1.default)(error, res);
    }
};
exports.businessPdpa = businessPdpa;
const admin = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refresh))
            return res.status(401).json({
                status: 401,
                code: 'Unauthorized',
                message: 'Unauthorized',
            });
        const refreshToken = cookies.refresh;
        const foundUser = await models_1.UserModel.findOne({ refreshToken }).exec();
        if (foundUser.role == 'admin') {
            next();
        }
        else {
            res.status(403).json({
                status: 403,
                code: 'ERROR_ACCESS',
                message: 'Access denied',
            });
        }
    }
    catch (error) {
        (0, responseError_1.default)(error, res);
    }
};
exports.admin = admin;
const manager = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refresh))
            return res.status(401).json({
                status: 401,
                code: 'Unauthorized',
                message: 'Unauthorized',
            });
        const refreshToken = cookies.refresh;
        const foundUser = await models_1.UserModel.findOne({ refreshToken }).exec();
        if (foundUser.role == 'manager') {
            next();
        }
        else {
            res.status(403).json({
                status: 403,
                code: 'ERROR_ACCESS',
                message: 'Access denied',
            });
        }
    }
    catch (error) {
        (0, responseError_1.default)(error, res);
    }
};
exports.manager = manager;
const businessControlCommittee = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refresh))
            return res.status(401).json({
                status: 401,
                code: 'Unauthorized',
                message: 'Unauthorized',
            });
        const refreshToken = cookies.refresh;
        const foundUser = await models_1.UserModel.findOne({ refreshToken }).exec();
        if (foundUser.role == 'businessControlCommittee') {
            next();
        }
        else {
            res.status(403).json({
                status: 403,
                code: 'ERROR_ACCESS',
                message: 'Access denied',
            });
        }
    }
    catch (error) {
        (0, responseError_1.default)(error, res);
    }
};
exports.businessControlCommittee = businessControlCommittee;
