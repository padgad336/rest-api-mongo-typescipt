"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validationMessage = (req, res, next) => {
    try {
        const { subject, body, groupId, uid } = req.body;
        if (!subject || subject.trim() === '') {
            res.status(400).json({
                status: 400,
                code: 'ERROR_SUBJECT_REQUIRED',
                message: 'Subject is required',
            });
        }
        else if (!body || body.trim() === '') {
            res.status(400).json({
                status: 400,
                code: 'ERROR_BODY_REQUIRED',
                message: 'Body is required',
            });
        }
        else if (!groupId && !uid) {
            res.status(400).json({
                status: 400,
                code: 'ERROR_RECIEVER[groupId_or_uid]_REQUIRED',
                message: 'Body is required',
            });
        }
        else {
            next();
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            code: 'ERROR_INTERNAL_SERVER',
            message: 'Unknown Internal Server Error.',
        });
    }
};
exports.default = validationMessage;
