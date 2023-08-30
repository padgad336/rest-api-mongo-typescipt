"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseError_1 = __importDefault(require("../../../components/responseError"));
const user_1 = __importDefault(require("../../../../../models/user"));
const password_hash_1 = __importDefault(require("password-hash"));
const updatePasswordById = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { username, password, newPassword } = req.body;
        const foundUser = await user_1.default.findOne({ username: username }).exec();
        if (!foundUser)
            return res.sendStatus(401); //Unauthorized
        const match = password_hash_1.default.verify(password, `${foundUser === null || foundUser === void 0 ? void 0 : foundUser.password}`);
        if (match) {
            const hashedPassword = password_hash_1.default.generate(newPassword);
            const passwordData = {
                password: hashedPassword,
            };
            const response = await user_1.default.findByIdAndUpdate({ _id: userId }, passwordData);
            console.log(response);
            if (response) {
                res.status(200).json({
                    status: 200,
                    code: 'SUCCESS_PASSWORD_UPDATE',
                    message: 'Updated Password Success.',
                    check: true
                });
            }
        }
        if (!match) {
            res.send({ check: false });
        }
    }
    catch (e) {
        (0, responseError_1.default)(e, res);
    }
};
exports.default = updatePasswordById;
