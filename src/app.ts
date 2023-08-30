import express, { Application, Request, Response, NextFunction } from 'express';
import fs from 'fs'
import cors, { CorsOptions } from 'cors';
import path from 'path'
import config from 'config';
import { v1 as uuid } from 'uuid'
import { createServer, Server } from 'http';

import './db-config/mongoDB';
import routerv1 from './router/v1/router';
import { credentials } from './router/v1/middleware/credentials';
import { corsOptions } from '../config/corsOptions'
import cookieParser from 'cookie-parser';
import ExpressMongoSanitize from 'express-mongo-sanitize';
// import compression from 'compression';

const app: Application = express();
const port = config.get('app.port');
const host = config.get('app.host');

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
// app.use(compression());
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser() as any)
app.use(ExpressMongoSanitize());
// gzip compression
app.use('/asset', express.static(path.join(__dirname, '../uploads')))
app.use('/assetfile', express.static(path.join(__dirname, '../uploadfiles')))
/**
 * Router API V.1.
 * @remarks
 *  API Version 1
 */
app.post('/api/v1/uploadstaff', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filename = `${uuid()}.png`;
    const pathImg = `${__dirname}/../uploads/${filename}`;
    const { photo } = req.body;
    const { dataphoto, type } = photo;

    if (type === 'base64') {
      const base64Data = dataphoto.replace(/^data:([A-Za-z-+/]+);base64,/, '');
      fs.writeFileSync(pathImg, base64Data, { encoding: 'base64' });
      res.send({
        url: `${host}/asset/${filename}`,
      });
    }
    if (type === 'url') {
      res.send({
        url: dataphoto,
      });
    }
  } catch (err) {
    next(err)
  }
})

app.post('/api/v1/upload', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uploadedImages: string[] = [];
    req.body.photo.forEach((photo: any) => {
      const filename = `${uuid()}.png`;
      const pathImg = `${__dirname}/../uploads/${filename}`;

      if (photo) {
        const base64Data = photo.base64.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        fs.writeFileSync(pathImg, base64Data, { encoding: 'base64' });
        uploadedImages.push(`${host}/asset/${filename}`);
      }
    });

    res.send({
      urls: uploadedImages || [],
    });
  } catch (err) {
    next(err);
  }
});

app.post('/api/v1/updatePhoto', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uploadedImages: string[] = [];
    const { newPhoto, defPhoto } = req.body;
    const commonElements = newPhoto.filter((newpho: string) => defPhoto.includes(newpho));
    const differentElements = newPhoto.filter((newpho: string) => !defPhoto.includes(newpho));
    const missingElements = defPhoto.filter((defpho: string) => !newPhoto.includes(defpho));

    await differentElements.forEach((photo: any) => {
      const filename = `${uuid()}.png`;
      const pathImg = `${__dirname}/../uploads/${filename}`;

      if (photo) {
        const base64Data = photo.base64.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        fs.writeFileSync(pathImg, base64Data, { encoding: 'base64' });
        uploadedImages.push(`${host}/asset/${filename}`);
      }
    });

    await commonElements.forEach((photo: any) => {
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
  } catch (err) {
    next(err);
  }
});

app.post('/api/v1/uploadfiles', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filename = `${uuid()}.txt`;
    const pathTxt = path.join(__dirname, '../uploadfiles', filename);
    const { text } = req.body;
    if (text) {
      fs.writeFileSync(pathTxt, text);
      res.send({
        url: `${host}/assetfile/${filename}`,
      });
    } else {
      res.send({ message: 'No file provided' });
    }
  } catch (err) {
    next(err);
  }
});

app.delete('/api/v1/deleteonephoto/:filenames', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filenames = req.params.filenames;
    const pathImg = `${__dirname}/../uploads/${filenames}`;
    fs.unlinkSync(pathImg);
    res.status(200).json({
      status: 200,
      code: 'SUCCESS_PHOTO_ITEM_REMOVE',
      message: 'Removed Photo Item Success.',
    });
  } catch (err) {
    res.send(err);
  }
});

app.delete('/api/v1/deletephoto/:filenames', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filenames: string[] = req.params.filenames.split(',');
    const successDeletions: string[] = [];
    const errorDeletions: { filename: string; error: string }[] = [];

    filenames.forEach((filename: string) => {
      const pathImg: string = `${__dirname}/../uploads/${filename}`;
      try {
        fs.unlinkSync(pathImg);
        successDeletions.push(filename);
      } catch (err: any) {
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
  } catch (err: any) {
    res.status(500).json({
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An error occurred while deleting the photos.',
      error: err.message,
    });
  }
});

app.delete('/api/v1/deletefile/:filename', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filename = req.params.filename;
    const pathTxt = `${__dirname}/../uploadfiles/${filename}`;
    fs.unlink(pathTxt, (err) => {
      if (err) {
        // Handle error
        res.status(500).json({
          status: 500,
          code: 'ERROR_TXT_FILE_REMOVE',
          message: 'Failed to remove Txt file.',
        });
      } else {
        res.status(200).json({
          status: 200,
          code: 'SUCCESS_TXT_FILE_REMOVE',
          message: 'Removed Txt file Success.',
        });
      }
    });
  } catch (err) {
    res.send(err);
  }
});


app.use('/api/v1/', routerv1);
app.get('/', (req: Request, res: Response) => {
  res.send('🚀 running on http://[host]/api/v1`) ');
});
const httpServer: Server = createServer(app);

httpServer.listen(port, () => {
  console.log(`Rest API is now running on http://localhost:${port}/api/v1`);
});
