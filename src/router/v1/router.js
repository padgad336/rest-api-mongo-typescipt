"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth = __importStar(require("./auth/auth"));
const validUser = __importStar(require("./controller/user/validate"));
const validLogin = __importStar(require("./controller/login/validate"));
const login = __importStar(require("./controller/login/controller"));
const logout = __importStar(require("./controller/logout/controller"));
const accessToken = __importStar(require("./controller/accestoken/controller"));
const me = __importStar(require("./controller/me/controller"));
const user = __importStar(require("./controller/user/controller"));
// http://localhost:4000/api/v1/message
const routerV1 = (0, express_1.Router)();
routerV1.get('/', (req, res) => {
    res.send('🚀 Welcome Ropa Version 1 🚀');
});
routerV1.route('/updatePassword/:userId')
    .put(auth.check, user.updatePasswordById);
routerV1.route('/checkusername/:username')
    .get(user.checkUserName);
routerV1.route('/userinfo/:userId')
    .get(user.getUserById);
routerV1.route('/updateUser/:userId')
    .put(auth.check, user.updateUserById);
routerV1.route('/getalluser')
    .get(user.getAllUser);
routerV1.route('/userremove/:userId')
    .delete(auth.check, user.deleteUserById);
routerV1.route('/user')
    .post(validUser.validationUser, user.createUser)
    .get(user.getAllUser);
routerV1.route('/login')
    .post(validLogin.validationLogin, login.createLogin);
routerV1.route('/logout')
    .get(auth.check, logout.handleLogout);
routerV1.route('/me')
    .get(auth.check, me.getMe);
routerV1.route('/accesstoken')
    .get(accessToken.handleAccessToken);
exports.default = routerV1;
