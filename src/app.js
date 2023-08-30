"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("config"));
const uuid_1 = require("uuid");
const http_1 = require("http");
require("./db-config/mongoDB");
const router_1 = __importDefault(require("./router/v1/router"));
const credentials_1 = require("./router/v1/middleware/credentials");
const corsOptions_1 = require("../config/corsOptions");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
// import compression from 'compression';
const app = (0, express_1.default)();
const port = config_1.default.get('app.port');
const host = config_1.default.get('app.host');
// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
// app.use(compression());
app.use(credentials_1.credentials);
app.use((0, cors_1.default)(corsOptions_1.corsOptions));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use(express_1.default.json({ limit: '50mb' }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
// gzip compression
app.use('/asset', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use('/assetfile', express_1.default.static(path_1.default.join(__dirname, '../uploadfiles')));
/**
 * Router API V.1.
 * @remarks
 *  API Version 1
 */
app.post('/api/v1/uploadstaff', async (req, res, next) => {
    try {
        const filename = `${(0, uuid_1.v1)()}.png`;
        const pathImg = `${__dirname}/../uploads/${filename}`;
        const { photo } = req.body;
        const { dataphoto, type } = photo;
        if (type === 'base64') {
            const base64Data = dataphoto.replace(/^data:([A-Za-z-+/]+);base64,/, '');
            fs_1.default.writeFileSync(pathImg, base64Data, { encoding: 'base64' });
            res.send({
                url: `${host}/asset/${filename}`,
            });
        }
        if (type === 'url') {
            res.send({
                url: dataphoto,
            });
        }
    }
    catch (err) {
        next(err);
    }
});
app.post('/api/v1/upload', async (req, res, next) => {
    try {
        const uploadedImages = [];
        req.body.photo.forEach((photo) => {
            const filename = `${(0, uuid_1.v1)()}.png`;
            const pathImg = `${__dirname}/../uploads/${filename}`;
            if (photo) {
                const base64Data = photo.base64.replace(/^data:([A-Za-z-+/]+);base64,/, '');
                fs_1.default.writeFileSync(pathImg, base64Data, { encoding: 'base64' });
                uploadedImages.push(`${host}/asset/${filename}`);
            }
        });
        res.send({
            urls: uploadedImages || [],
        });
    }
    catch (err) {
        next(err);
    }
});
app.post('/api/v1/updatePhoto', async (req, res, next) => {
    try {
        const uploadedImages = [];
        const { newPhoto, defPhoto } = req.body;
        const commonElements = newPhoto.filter((newpho) => defPhoto.includes(newpho));
        const differentElements = newPhoto.filter((newpho) => !defPhoto.includes(newpho));
        const missingElements = defPhoto.filter((defpho) => !newPhoto.includes(defpho));
        await differentElements.forEach((photo) => {
            const filename = `${(0, uuid_1.v1)()}.png`;
            const pathImg = `${__dirname}/../uploads/${filename}`;
            if (photo) {
                const base64Data = photo.base64.replace(/^data:([A-Za-z-+/]+);base64,/, '');
                fs_1.default.writeFileSync(pathImg, base64Data, { encoding: 'base64' });
                uploadedImages.push(`${host}/asset/${filename}`);
            }
        });
        await commonElements.forEach((photo) => {
            uploadedImages.push(`${photo}`);
        });
        res.send({
            urls: uploadedImages || [],
            missingUrls: missingElements || [],
        });
        // res.send({
        //   commonElements: commonElements,
        //   differentElements: differentElements,
        //   missingElements: missingElements,
        // });
    }
    catch (err) {
        next(err);
    }
});
app.post('/api/v1/uploadfiles', async (req, res, next) => {
    try {
        const filename = `${(0, uuid_1.v1)()}.txt`;
        const pathTxt = path_1.default.join(__dirname, '../uploadfiles', filename);
        const { text } = req.body;
        if (text) {
            fs_1.default.writeFileSync(pathTxt, text);
            res.send({
                url: `${host}/assetfile/${filename}`,
            });
        }
        else {
            res.send({ message: 'No file provided' });
        }
    }
    catch (err) {
        next(err);
    }
});
app.delete('/api/v1/deleteonephoto/:filenames', async (req, res, next) => {
    try {
        const filenames = req.params.filenames;
        const pathImg = `${__dirname}/../uploads/${filenames}`;
        fs_1.default.unlinkSync(pathImg);
        res.status(200).json({
            status: 200,
            code: 'SUCCESS_PHOTO_ITEM_REMOVE',
            message: 'Removed Photo Item Success.',
        });
    }
    catch (err) {
        res.send(err);
    }
});
app.delete('/api/v1/deletephoto/:filenames', async (req, res, next) => {
    try {
        const filenames = req.params.filenames.split(',');
        const successDeletions = [];
        const errorDeletions = [];
        filenames.forEach((filename) => {
            const pathImg = `${__dirname}/../uploads/${filename}`;
            try {
                fs_1.default.unlinkSync(pathImg);
                successDeletions.push(filename);
            }
            catch (err) {
                errorDeletions.push({ filename, error: err.message });
            }
        });
        res.status(200).json({
            status: 200,
            code: 'SUCCESS_PHOTO_ITEMS_REMOVE',
            message: 'Removed Photo Items Success.',
            successDeletions,
            errorDeletions,
        });
    }
    catch (err) {
        res.status(500).json({
            status: 500,
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An error occurred while deleting the photos.',
            error: err.message,
        });
    }
});
app.delete('/api/v1/deletefile/:filename', async (req, res, next) => {
    try {
        const filename = req.params.filename;
        const pathTxt = `${__dirname}/../uploadfiles/${filename}`;
        fs_1.default.unlink(pathTxt, (err) => {
            if (err) {
                // Handle error
                res.status(500).json({
                    status: 500,
                    code: 'ERROR_TXT_FILE_REMOVE',
                    message: 'Failed to remove Txt file.',
                });
            }
            else {
                res.status(200).json({
                    status: 200,
                    code: 'SUCCESS_TXT_FILE_REMOVE',
                    message: 'Removed Txt file Success.',
                });
            }
        });
    }
    catch (err) {
        res.send(err);
    }
});
app.use('/api/v1/', router_1.default);
app.get('/', (req, res) => {
    res.send('🚀 running on http://[host]/api/v1`) ');
});
const httpServer = (0, http_1.createServer)(app);
httpServer.listen(port, () => {
    console.log(`Rest API is now running on http://localhost:${port}/api/v1`);
});
