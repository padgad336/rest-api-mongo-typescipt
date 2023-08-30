"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ResponseError = (error, res) => {
    console.error(error);
    res.status(500).json({
        status: 500,
        code: 'ERROR_INTERNAL_SERVER',
        message: 'Unknown Internal Server Error.',
    });
};
exports.default = ResponseError;
