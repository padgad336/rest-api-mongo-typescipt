"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseError_1 = __importDefault(require("../../../components/responseError"));
const user_1 = __importDefault(require("../../../../../models/user"));
const mongoose_1 = __importDefault(require("mongoose"));
const getUserById = async (req, res, next) => {
    try {
        const ObjectId = mongoose_1.default.Types.ObjectId;
        const { userId } = req.params;
        // console.log(userId);
        const response = await user_1.default.aggregate([
            {
                $match: {
                    _id: new ObjectId(`${userId}`),
                },
            },
            {
                $lookup: {
                    from: 'archives',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'items',
                },
            },
            {
                $limit: 1,
            },
        ]);
        // console.log(response[0]);
        if (response) {
            res.status(200).json(response[0]);
        }
    }
    catch (e) {
        (0, responseError_1.default)(e, res);
    }
};
exports.default = getUserById;
